import { NextResponse } from "next/server";
import { readReference } from "@/lib/storage";

export const dynamic = "force-dynamic";
// Customer reference images are private: only reachable by a logged-in admin (enforced by middleware).
export async function GET(_: Request, { params }: { params: { name: string } }) {
  const r = await readReference(params.name);
  if (!r) return new Response("Not found", { status: 404 });
  if (r.url) return NextResponse.redirect(r.url);
  const type = params.name.endsWith(".png") ? "image/png" : params.name.endsWith(".webp") ? "image/webp" : "image/jpeg";
  return new Response(new Uint8Array(r.data!), { headers: { "Content-Type": type, "Cache-Control": "private, no-store" } });
}
