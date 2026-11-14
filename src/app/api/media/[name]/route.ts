import { readLocalProductImage } from "@/lib/storage";
export const dynamic = "force-dynamic";
// Serves product images uploaded in local-development mode (production uses Supabase Storage public URLs).
export async function GET(_: Request, { params }: { params: { name: string } }) {
  const buf = await readLocalProductImage(params.name);
  if (!buf) return new Response("Not found", { status: 404 });
  const type = params.name.endsWith(".png") ? "image/png" : params.name.endsWith(".webp") ? "image/webp" : "image/jpeg";
  return new Response(new Uint8Array(buf), { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" } });
}
