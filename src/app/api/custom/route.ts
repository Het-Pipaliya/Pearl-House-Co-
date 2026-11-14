import { NextResponse } from "next/server";
import { createInquiryResilient, saveInquiry } from "@/lib/db";
import { sendInquiryEmails } from "@/lib/email";
import { emailHint } from "@/lib/emailHint";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { saveImage, UploadError } from "@/lib/storage";
import { customSchema, firstError, spamCheck } from "@/lib/validation";

export const dynamic = "force-dynamic";
const fail = (error: string, status: number, hint?: string) => NextResponse.json({ ok: false, error, ...(hint ? { hint } : {}) }, { status });

export async function POST(req: Request) {
  if (!rateLimit(`custom:${clientIp(req)}`, 4, 10 * 60_000)) return fail("Too many requests. Please try again in a few minutes.", 429);
  let form: FormData;
  try { form = await req.formData(); } catch { return fail("Invalid request.", 400); }
  const raw: Record<string, string> = {};
  for (const [k, v] of form.entries()) if (typeof v === "string") raw[k] = v;
  const parsed = customSchema.safeParse(raw);
  if (!parsed.success) return fail(firstError(parsed.error), 400);
  const d = parsed.data;
  const spam = spamCheck(d);
  if (spam === "silent") return NextResponse.json({ ok: true, reference: "PH-000000-XXXXX" });
  if (spam) return fail(spam, 400);

  const files = form.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > 4) return fail("Please attach no more than 4 reference images.", 400);
  try {
    const refs: string[] = [];
    for (const f of files) refs.push(await saveImage(f, "references"));
    const { inquiry, stored } = await createInquiryResilient((id) => ({
      id, type: "custom", status: "New Inquiry", createdAt: new Date().toISOString(),
      customer: { name: d.name, email: d.email, phone: d.phone, contactMethod: d.contactMethod },
      items: [], custom: { jewelryType: d.jewelryType, metal: d.metal, gemstone: d.gemstone, budget: d.budget, description: d.description, referenceImages: refs },
      emailStatus: { business: "pending", customer: "pending" },
    }));
    inquiry.emailStatus = await sendInquiryEmails(inquiry);
    if (stored) await saveInquiry(inquiry).catch(() => {});
    else if (inquiry.emailStatus.business !== "sent") {
      console.error("custom request email not delivered:", inquiry.emailStatus.business);
      return fail("We couldn't send your request just now. Please try again in a moment.", 500, emailHint(inquiry.emailStatus.business));
    }
    return NextResponse.json({ ok: true, reference: inquiry.id });
  } catch (e) {
    if (e instanceof UploadError) return fail(e.message, 400);
    console.error("custom request failed", e);
    return fail("We couldn't save your request just now. Please try again in a moment.", 500);
  }
}
