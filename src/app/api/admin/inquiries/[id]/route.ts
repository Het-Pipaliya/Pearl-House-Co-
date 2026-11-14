import { NextResponse } from "next/server";
import { getInquiry, saveInquiry } from "@/lib/db";
import { statusSchema } from "@/lib/validation";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const parsed = statusSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  const inq = await getInquiry(params.id);
  if (!inq) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (parsed.data.status) inq.status = parsed.data.status;
  if (parsed.data.adminNotes !== undefined) inq.adminNotes = parsed.data.adminNotes;
  await saveInquiry(inq);
  return NextResponse.json({ inquiry: inq });
}
