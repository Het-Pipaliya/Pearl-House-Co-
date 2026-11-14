import { NextResponse } from "next/server";
import { createInquiryResilient, getProducts, saveInquiry } from "@/lib/db";
import { sendInquiryEmails } from "@/lib/email";
import { authEnabled } from "@/lib/supabase/env";
import { getSessionUser } from "@/lib/supabase/server";
import { emailHint } from "@/lib/emailHint";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { firstError, orderSchema, spamCheck } from "@/lib/validation";
import type { Inquiry } from "@/lib/types";

export const dynamic = "force-dynamic";
const fail = (error: string, status: number, hint?: string) => NextResponse.json({ ok: false, error, ...(hint ? { hint } : {}) }, { status });

export async function POST(req: Request) {
  if (!rateLimit(`order:${clientIp(req)}`, 5, 10 * 60_000)) return fail("Too many requests. Please try again in a few minutes.", 429);
  let body: unknown;
  try { body = await req.json(); } catch { return fail("Invalid request.", 400); }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return fail(firstError(parsed.error), 400);
  const d = parsed.data;

  const spam = spamCheck(d);
  if (spam === "silent") return NextResponse.json({ ok: true, reference: "PH-000000-XXXXX" }); // bots get a fake success; nothing stored
  if (spam) return fail(spam, 400);

  const user = await getSessionUser();
  if (authEnabled && !user) return fail("Please sign in to send your order request.", 401);
  try {
    // Never trust names/options from the browser: rebuild each line from the catalogue.
    const catalogue = new Map((await getProducts()).map((p) => [p.id, p]));
    const items: Inquiry["items"] = [];
    for (const it of d.items) {
      const p = catalogue.get(it.productId);
      if (!p) return fail("One of the items in your cart is no longer in our catalogue. Please review your cart.", 400);
      if (!p.available) return fail(`“${p.name}” is currently unavailable. Please remove it from your cart.`, 400);
      if (p.sizes.length && !p.sizes.includes(it.size ?? "")) return fail(`Please choose a size for “${p.name}”.`, 400);
      if (p.metals.length && !p.metals.includes(it.metal as never)) return fail(`Please choose a metal for “${p.name}”.`, 400);
      if (it.gemstone && !p.gemstoneOptions.includes(it.gemstone)) return fail(`Invalid gemstone option for “${p.name}”.`, 400);
      items.push({ productId: p.id, name: p.name, quantity: it.quantity, size: it.size || undefined, metal: it.metal || undefined, gemstone: it.gemstone || undefined, customization: p.customization ? it.customization || undefined : undefined });
    }
    const { inquiry, stored } = await createInquiryResilient((id) => ({
      id, userId: user?.id, type: "order", status: "New Inquiry", createdAt: new Date().toISOString(),
      customer: { name: d.name, email: d.email, phone: d.phone, city: d.city, state: d.state, country: d.country, contactMethod: d.contactMethod },
      items, instructions: d.instructions, notes: d.notes, emailStatus: { business: "pending", customer: "pending" },
    }));
    // Email problems never lose a stored request; the result is recorded for the admin.
    inquiry.emailStatus = await sendInquiryEmails(inquiry);
    if (stored) await saveInquiry(inquiry).catch(() => {});
    // With no database, the business email is the only record: if it was not delivered, fail so the cart is kept.
    else if (inquiry.emailStatus.business !== "sent") {
      console.error("order email not delivered:", inquiry.emailStatus.business);
      return fail("We couldn't send your request just now. Your cart has been kept — please try again in a moment.", 500, emailHint(inquiry.emailStatus.business));
    }
    return NextResponse.json({ ok: true, reference: inquiry.id });
  } catch (e) {
    console.error("order submission failed", e);
    return fail("We couldn't save your request just now. Your cart has been kept — please try again in a moment.", 500);
  }
}
