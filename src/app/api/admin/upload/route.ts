import { NextResponse } from "next/server";
import { saveImage, UploadError } from "@/lib/storage";

export async function POST(req: Request) {
  const f = (await req.formData().catch(() => null))?.get("file");
  if (!(f instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  try { return NextResponse.json({ url: await saveImage(f, "products") }); }
  catch (e) { return NextResponse.json({ error: e instanceof UploadError ? e.message : "Upload failed. Check storage configuration." }, { status: e instanceof UploadError ? 400 : 500 }); }
}
