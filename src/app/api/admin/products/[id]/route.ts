import { NextResponse } from "next/server";
import { deleteProduct, getProduct, getProducts, saveProduct } from "@/lib/db";
import { firstError, productSchema } from "@/lib/validation";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const existing = await getProduct(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = productSchema.safeParse({ ...(await req.json().catch(() => ({}))), id: params.id });
  if (!parsed.success) return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  if ((await getProducts()).some((p) => p.slug === parsed.data.slug && p.id !== params.id)) return NextResponse.json({ error: "That slug is already used by another product." }, { status: 409 });
  await saveProduct({ ...parsed.data, createdAt: existing.createdAt });
  return NextResponse.json({ ok: true });
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await deleteProduct(params.id);
  return NextResponse.json({ ok: true });
}
