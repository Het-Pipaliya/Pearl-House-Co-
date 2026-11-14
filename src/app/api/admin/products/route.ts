import { NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/db";
import { firstError, productSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json({ products: await getProducts() }); }
export async function POST(req: Request) {
  const parsed = productSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  const all = await getProducts();
  if (all.some((p) => p.slug === parsed.data.slug)) return NextResponse.json({ error: "That slug is already used by another product." }, { status: 409 });
  const ok = await createProduct({ ...parsed.data, createdAt: new Date().toISOString() });
  if (!ok) return NextResponse.json({ error: "A product with that SKU already exists." }, { status: 409 });
  return NextResponse.json({ ok: true });
}
