"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { Field, Honeypot, useOpenedAt } from "./Field";

const METHODS = ["Email", "Phone call", "WhatsApp / text message"];

export default function CartView() {
  const { lines, remove, setQty, setNote, clear, ready } = useCart();
  const router = useRouter();
  const openedAt = useOpenedAt();
  const [form, setForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({ name: "", email: "", phone: "", city: "", state: "", country: "", contactMethod: "Email", instructions: "", notes: "", website: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  if (!ready) return <p className="py-24 text-center text-cocoa/60">Loading your cart…</p>;
  if (!lines.length) return <div className="py-24 text-center"><p className="mb-8 font-serif text-2xl">Your cart is empty</p><Link href="/shop" className="btn">Explore Collections</Link></div>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (busy) return;
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, openedAt, items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity, size: l.size, metal: l.metal, gemstone: l.gemstone, customization: l.customization })) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) { setError(data?.error ?? "Something went wrong. Your cart has been kept — please try again."); setBusy(false); return; }
      clear(); // only after the server confirmed the request was saved
      router.push(`/order/success?ref=${encodeURIComponent(data.reference)}`);
    } catch {
      setError("We couldn't reach the server. Your cart has been kept — please check your connection and try again."); setBusy(false);
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
      <section aria-label="Cart items">
        <ul className="divide-y divide-blush border-y border-blush">
          {lines.map((l) => (
            <li key={l.key} className="grid grid-cols-[88px_1fr] gap-5 py-6 sm:grid-cols-[120px_1fr]">
              <Link href={`/shop/${l.slug}`}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={l.image} alt={l.name} className="aspect-square w-full bg-blush/40 object-cover" /></Link>
              <div>
                <div className="flex justify-between gap-3"><h2 className="text-xl"><Link href={`/shop/${l.slug}`}>{l.name}</Link></h2><button onClick={() => remove(l.key)} className="text-xs uppercase tracking-widest text-cocoa/60 hover:text-rose" aria-label={`Remove ${l.name}`}>Remove</button></div>
                <p className="text-xs text-cocoa/55">SKU {l.productId}</p>
                <p className="mt-2 text-sm text-cocoa/80">{[l.metal, l.size && `Size ${l.size}`, l.gemstone].filter(Boolean).join(" · ") || "Standard configuration"}</p>
                <label className="mt-3 block text-xs uppercase tracking-widest text-cocoa/60" htmlFor={`n-${l.key}`}>Customization notes</label>
                <input id={`n-${l.key}`} className="input mt-1 !py-2" defaultValue={l.customization ?? ""} maxLength={1000} onBlur={(e) => setNote(l.key, e.target.value)} placeholder="Engraving, stone size, special requests…" />
                <div className="mt-4 inline-flex items-center border border-blush bg-white" role="group" aria-label={`Quantity for ${l.name}`}>
                  <button className="px-3.5 py-2" aria-label="Decrease quantity" onClick={() => setQty(l.key, l.quantity - 1)}>−</button>
                  <span className="w-8 text-center">{l.quantity}</span>
                  <button className="px-3.5 py-2" aria-label="Increase quantity" onClick={() => setQty(l.key, l.quantity + 1)}>+</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/shop" className="link-u mt-6 inline-block text-sm text-rose">← Continue shopping</Link>
      </section>

      <aside className="h-fit border border-blush bg-white p-6 sm:p-8 lg:sticky lg:top-40">
        <h2 className="text-2xl">Order Request</h2>
        <p className="mt-3 text-sm leading-relaxed text-cocoa/70">{lines.reduce((n, l) => n + l.quantity, 0)} item(s). Pricing, availability and delivery are confirmed with you personally by our team. <strong>No payment is taken online.</strong></p>
        {!form ? <button className="btn mt-6 w-full" onClick={() => setForm(true)}>Submit Order Request</button> : (
          <form onSubmit={submit} className="relative mt-6 space-y-4" noValidate={false}>
            <Honeypot value={f.website} onChange={(v) => setF({ ...f, website: v })} />
            <Field label="Full name" id="o-name" required><input id="o-name" required maxLength={120} autoComplete="name" className="input" value={f.name} onChange={set("name")} /></Field>
            <Field label="Email address" id="o-email" required><input id="o-email" type="email" required autoComplete="email" className="input" value={f.email} onChange={set("email")} /></Field>
            <Field label="Phone number" id="o-phone" required><input id="o-phone" type="tel" required autoComplete="tel" className="input" value={f.phone} onChange={set("phone")} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Shipping city" id="o-city"><input id="o-city" className="input" autoComplete="address-level2" value={f.city} onChange={set("city")} /></Field>
              <Field label="State" id="o-state"><input id="o-state" className="input" autoComplete="address-level1" value={f.state} onChange={set("state")} /></Field>
            </div>
            <Field label="Shipping country" id="o-country"><input id="o-country" className="input" autoComplete="country-name" value={f.country} onChange={set("country")} /></Field>
            <Field label="Preferred contact method" id="o-cm"><select id="o-cm" className="input" value={f.contactMethod} onChange={set("contactMethod")}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select></Field>
            <Field label="Additional instructions" id="o-ins"><textarea id="o-ins" rows={3} maxLength={2000} className="input" value={f.instructions} onChange={set("instructions")} /></Field>
            <Field label="Order notes" id="o-notes"><textarea id="o-notes" rows={3} maxLength={2000} className="input" value={f.notes} onChange={set("notes")} /></Field>
            {error && <p role="alert" className="border border-rose/40 bg-blush/50 p-3 text-sm text-rose-dark">{error}</p>}
            <button className="btn w-full" disabled={busy}>{busy ? "Sending…" : "Send Order Request"}</button>
            <p className="text-xs text-cocoa/55">Submitting does not confirm a purchase. Your details are used only to respond to your request — see our <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
          </form>
        )}
      </aside>
    </div>
  );
}
