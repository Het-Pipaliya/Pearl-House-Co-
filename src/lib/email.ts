import "server-only";
import { cfg } from "./config";
import type { Inquiry } from "./types";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export type SendResult = "sent" | "not_configured" | `failed: ${string}`;

async function send(to: string, subject: string, html: string, replyTo?: string): Promise<SendResult> {
  if (!cfg.resendKey || !to) return "not_configured"; // never pretend: status is stored on the inquiry and shown in the admin
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: cfg.fromEmail, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!res.ok) return `failed: ${res.status} ${(await res.text()).slice(0, 160)}`;
    return "sent";
  } catch (e) { return `failed: ${(e as Error).message}`; }
}

const row = (k: string, v?: string) => (v ? `<tr><td style="padding:6px 16px 6px 0;color:#8a6f68;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#49302B">${esc(v).replace(/\n/g, "<br>")}</td></tr>` : "");
const shell = (inner: string) => `<div style="background:#FCF8F6;padding:24px;font-family:Helvetica,Arial,sans-serif"><div style="max-width:640px;margin:auto;background:#fff;border:1px solid #F1DAD5;padding:32px;color:#49302B;line-height:1.6">
<div style="font-family:Georgia,serif;font-size:22px;letter-spacing:.18em;color:#B76E62;text-transform:uppercase;text-align:center;margin-bottom:24px">Pearl House &amp; Co</div>${inner}</div></div>`;

function itemsTable(i: Inquiry) {
  if (!i.items.length) return "";
  return `<h3 style="font-family:Georgia,serif;color:#B76E62;margin:24px 0 8px">Requested pieces</h3><table style="width:100%;border-collapse:collapse;font-size:14px">${i.items.map((it) =>
    `<tr><td style="border-top:1px solid #F1DAD5;padding:10px 0"><strong>${esc(it.name)}</strong> × ${it.quantity}<br><span style="color:#8a6f68">SKU ${esc(it.productId)}</span><br>${[it.size && `Size: ${esc(it.size)}`, it.metal && `Metal: ${esc(it.metal)}`, it.gemstone && `Gemstone: ${esc(it.gemstone)}`].filter(Boolean).join(" · ")}${it.customization ? `<br>Customization: ${esc(it.customization)}` : ""}</td></tr>`).join("")}</table>`;
}

export async function sendInquiryEmails(i: Inquiry) {
  const c = i.customer;
  const when = new Date(i.createdAt).toUTCString();
  const customBlock = i.custom ? `<h3 style="font-family:Georgia,serif;color:#B76E62;margin:24px 0 8px">Custom design request</h3><table>${row("Jewelry type", i.custom.jewelryType)}${row("Preferred metal", i.custom.metal)}${row("Gemstone", i.custom.gemstone)}${row("Budget", i.custom.budget)}${row("Description", i.custom.description)}${row("Reference images", i.custom.referenceImages.length ? `${i.custom.referenceImages.length} attached — view in admin dashboard` : "None")}</table>` : "";
  const label = i.type === "custom" ? "Custom Design Request" : "Order Request";
  const business = await send(
    cfg.businessEmail,
    i.type === "custom" ? `New Custom Jewelry Request — Pearl House & Co — #${i.id}` : `New Jewelry Order Request — Pearl House & Co — #${i.id}`,
    shell(`<h2 style="font-family:Georgia,serif;margin:0 0 4px">New ${label}</h2><p style="margin:0 0 16px;color:#8a6f68">Reference #${esc(i.id)} · ${esc(when)}</p>${i.notStored ? `<p style="background:#F1DAD5;border:1px solid #B76E62;padding:10px 14px;color:#49302B"><strong>Not saved to a database.</strong> This email is the only record of this request. Please keep it.</p>` : ""}
<table style="font-size:14px">${row("Name", c.name)}${row("Email", c.email)}${row("Phone", c.phone)}${row("Preferred contact", c.contactMethod)}${row("City", c.city)}${row("State", c.state)}${row("Country", c.country)}</table>
${itemsTable(i)}${customBlock}<table style="margin-top:16px;font-size:14px">${row("Additional instructions", i.instructions)}${row("Order notes", i.notes)}</table>
<p style="margin-top:24px;font-size:12px;color:#8a6f68">This is an inquiry, not a confirmed purchase. No payment has been taken.</p>`),
    c.email,
  );
  const customer = await send(
    c.email,
    `We've received your request — Pearl House & Co — #${i.id}`,
    shell(`<h2 style="font-family:Georgia,serif;margin:0 0 12px">Thank you for choosing Pearl House &amp; Co!</h2>
<p>Dear ${esc(c.name)},</p><p>Your ${i.type === "custom" ? "custom design request" : "order request"} has been successfully received.</p>
<p style="background:#FCF8F6;border:1px solid #F1DAD5;padding:12px 16px">Your inquiry number: <strong>${esc(i.id)}</strong></p>
<p>Our team will review your request and contact you to confirm availability, customization options, final pricing, and next steps.</p>
${itemsTable(i)}<p style="margin-top:24px">Please note that submitting a request does not confirm a purchase or require payment.</p><p>We look forward to helping you find something extraordinary.</p>`),
  );
  return { business, customer };
}

export async function sendContactEmail(m: { name: string; email: string; phone?: string; message: string }) {
  return send(cfg.businessEmail, `New Contact Message — Pearl House & Co — ${m.name}`,
    shell(`<h2 style="font-family:Georgia,serif">New contact message</h2><table style="font-size:14px">${row("Name", m.name)}${row("Email", m.email)}${row("Phone", m.phone)}${row("Message", m.message)}</table>`), m.email);
}
