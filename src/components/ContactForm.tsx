"use client";
import { useState } from "react";
import { Field, Honeypot, useOpenedAt } from "./Field";
import NextSteps from "./NextSteps";

export default function ContactForm({ product }: { product?: string }) {
  const openedAt = useOpenedAt();
  const [f, setF] = useState({ name: "", email: "", phone: "", message: product ? `I'd like more information about: ${product}\n\n` : "", website: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, openedAt }) });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.ok) setErr(d?.error ?? "Something went wrong. Please try again."); else setDone(true);
    } catch { setErr("We couldn't reach the server. Please try again."); }
    setBusy(false);
  };
  if (done) return <div role="status" className="border border-blush bg-white p-8 text-center"><h3 className="text-2xl">Message sent</h3><p className="mt-3 text-cocoa/75">Thank you for getting in touch.</p><NextSteps hasNumber={false} className="mt-5" /></div>;
  return (
    <form onSubmit={submit} className="relative space-y-5 border border-blush bg-white p-6 sm:p-8">
      <Honeypot value={f.website} onChange={(v) => setF({ ...f, website: v })} />
      <Field label="Name" id="m-name" required><input id="m-name" required maxLength={120} className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <Field label="Email" id="m-email" required><input id="m-email" type="email" required className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
      <Field label="Phone (optional)" id="m-phone"><input id="m-phone" type="tel" className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
      <Field label="Message" id="m-msg" required><textarea id="m-msg" required minLength={10} maxLength={4000} rows={6} className="input" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></Field>
      {err && <p role="alert" className="border border-rose/40 bg-blush/50 p-3 text-sm text-rose-dark">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? "Sending…" : "Send Message"}</button>
    </form>
  );
}
