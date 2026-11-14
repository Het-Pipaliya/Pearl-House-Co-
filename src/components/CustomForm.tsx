"use client";
import { useState } from "react";
import { Field, Honeypot, useOpenedAt } from "./Field";

const TYPES = ["Engagement Ring", "Ring", "Wedding Band", "Necklace", "Pendant", "Bracelet", "Earrings", "Other"];
const METALS = ["No preference", "Yellow Gold", "White Gold", "Rose Gold", "Platinum"];
const BUDGETS = ["Not sure yet", "Under $1,000", "$1,000 – $3,000", "$3,000 – $7,500", "$7,500 – $15,000", "$15,000+"];

export default function CustomForm() {
  const openedAt = useOpenedAt();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [hint, setHint] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [hp, setHp] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setBusy(true); setErr(""); setHint("");
    const fd = new FormData(e.currentTarget);
    fd.set("website", hp); fd.set("openedAt", String(openedAt));
    try {
      const res = await fetch("/api/custom", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) { setErr(data?.error ?? "Something went wrong. Please try again."); setHint(data?.hint ?? ""); } else setDone(data.reference);
    } catch { setErr("We couldn't reach the server. Please try again."); }
    setBusy(false);
  };

  if (done) return (
    <div className="border border-blush bg-white p-10 text-center" role="status">
      <h2 className="text-3xl">Thank you for your inquiry.</h2>
      <p className="mt-4 text-cocoa/80">Thank you for your inquiry. Our team will review your request and contact you to discuss the next steps.</p>
      <p className="mt-6 text-sm text-cocoa/60">Inquiry number: <strong className="text-rose">{done}</strong></p>
    </div>
  );
  return (
    <form onSubmit={submit} className="relative grid gap-5 border border-blush bg-white p-6 sm:grid-cols-2 sm:p-10">
      <Honeypot value={hp} onChange={setHp} />
      <Field label="Full name" id="c-name" required><input id="c-name" name="name" required maxLength={120} className="input" autoComplete="name" /></Field>
      <Field label="Email address" id="c-email" required><input id="c-email" name="email" type="email" required className="input" autoComplete="email" /></Field>
      <Field label="Phone number" id="c-phone" required><input id="c-phone" name="phone" type="tel" required className="input" autoComplete="tel" /></Field>
      <Field label="Preferred contact method" id="c-cm"><select id="c-cm" name="contactMethod" className="input"><option>Email</option><option>Phone call</option><option>WhatsApp / text message</option></select></Field>
      <Field label="Jewelry type" id="c-type" required><select id="c-type" name="jewelryType" required className="input">{TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
      <Field label="Preferred metal" id="c-metal"><select id="c-metal" name="metal" className="input">{METALS.map((t) => <option key={t}>{t}</option>)}</select></Field>
      <Field label="Gemstone preference" id="c-gem"><input id="c-gem" name="gemstone" maxLength={120} className="input" placeholder="e.g. diamond, sapphire, pearl" /></Field>
      <Field label="Approximate budget" id="c-bud"><select id="c-bud" name="budget" className="input">{BUDGETS.map((t) => <option key={t}>{t}</option>)}</select></Field>
      <div className="sm:col-span-2"><Field label="Description of desired design" id="c-desc" required><textarea id="c-desc" name="description" required minLength={20} maxLength={4000} rows={6} className="input" placeholder="Tell us about the piece you imagine, the occasion, and any details that matter to you." /></Field></div>
      <div className="sm:col-span-2"><Field label="Upload reference images (up to 4 · JPG, PNG or WebP · 5 MB each)" id="c-img"><input id="c-img" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="input !p-2.5 file:mr-4 file:border-0 file:bg-blush file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest" /></Field></div>
      {err && <div role="alert" className="border border-rose/40 bg-blush/50 p-3 text-sm text-rose-dark sm:col-span-2">{err}{hint && <p className="mt-2 text-xs text-cocoa/70">Technical detail: {hint}</p>}</div>}
      <div className="sm:col-span-2"><button className="btn w-full sm:w-auto" disabled={busy}>{busy ? "Sending…" : "Submit Custom Design Request"}</button><p className="mt-3 text-xs text-cocoa/55">Submitting a request does not obligate you to purchase and requires no payment.</p></div>
    </form>
  );
}
