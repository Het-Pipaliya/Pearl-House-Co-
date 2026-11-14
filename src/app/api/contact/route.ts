import { NextResponse } from "next/server";
import { saveMessage } from "@/lib/db";
import { sendContactEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { contactSchema, firstError, spamCheck } from "@/lib/validation";

export const dynamic = "force-dynamic";
const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000)) return fail("Too many requests. Please try again in a few minutes.", 429);
  let body: unknown;
  try { body = await req.json(); } catch { return fail("Invalid request.", 400); }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return fail(firstError(parsed.error), 400);
  const d = parsed.data;
  const spam = spamCheck(d);
  if (spam === "silent") return NextResponse.json({ ok: true });
  if (spam) return fail(spam, 400);
  try {
    const saved = await saveMessage({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), name: d.name, email: d.email, phone: d.phone || undefined, message: d.message, read: false }).then(() => true, () => false);
    const mail = await sendContactEmail({ name: d.name, email: d.email, phone: d.phone || undefined, message: d.message });
    if (!saved && mail !== "sent") return fail("We couldn't send your message just now. Please try again.", 500);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact failed", e);
    return fail("We couldn't send your message just now. Please try again.", 500);
  }
}
