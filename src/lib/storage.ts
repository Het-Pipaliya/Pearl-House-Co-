import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { cfg, usingSupabase } from "./config";

const MAX_BYTES = 5 * 1024 * 1024;
const sniff = (b: Buffer): { ext: string; mime: string } | null => {
  if (b[0] === 0xff && b[1] === 0xd8) return { ext: "jpg", mime: "image/jpeg" };
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: "png", mime: "image/png" };
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return { ext: "webp", mime: "image/webp" };
  return null;
};
const sb = () => createClient(cfg.supabaseUrl, cfg.supabaseKey, { auth: { persistSession: false } });
const LOCAL = path.join(process.cwd(), ".data", "uploads");

export class UploadError extends Error {}

export interface CheckedImage { buf: Buffer; ext: string; mime: string }

/** Validates an upload by its file signature (not the client-supplied type or name). */
export async function checkImage(file: File): Promise<CheckedImage> {
  if (file.size > MAX_BYTES) throw new UploadError("Images must be 5 MB or smaller.");
  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind) throw new UploadError("Only JPG, PNG or WebP images are accepted.");
  return { buf, ...kind };
}

export async function saveImage(file: File, bucket: "products" | "references"): Promise<string> {
  return storeImage(await checkImage(file), bucket);
}

/** Stores an already-checked image. `bucket` public = product images, private = customer reference images. */
export async function storeImage({ buf, ext, mime }: CheckedImage, bucket: "products" | "references"): Promise<string> {
  const name = `${crypto.randomUUID()}.${ext}`;
  if (usingSupabase()) {
    const { error } = await sb().storage.from(bucket).upload(name, buf, { contentType: mime });
    if (error) throw new Error(error.message);
    // public bucket → public URL; private bucket → opaque reference resolved by the admin-only route
    return bucket === "products" ? sb().storage.from(bucket).getPublicUrl(name).data.publicUrl : `ref:${name}`;
  }
  await fs.mkdir(path.join(LOCAL, bucket), { recursive: true });
  await fs.writeFile(path.join(LOCAL, bucket, name), buf);
  return bucket === "products" ? `/api/media/${name}` : `ref:${name}`;
}

export async function readLocalProductImage(name: string) {
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(name)) return null;
  try { return await fs.readFile(path.join(LOCAL, "products", name)); } catch { return null; }
}

/** Admin only: resolve a private reference image. */
export async function readReference(name: string): Promise<{ url?: string; data?: Buffer } | null> {
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(name)) return null;
  if (usingSupabase()) {
    const { data } = await sb().storage.from("references").createSignedUrl(name, 120);
    return data?.signedUrl ? { url: data.signedUrl } : null;
  }
  try { return { data: await fs.readFile(path.join(LOCAL, "references", name)) }; } catch { return null; }
}
