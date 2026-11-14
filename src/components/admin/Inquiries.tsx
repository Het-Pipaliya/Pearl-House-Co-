"use client";
import { useMemo, useState } from "react";
import { STATUSES, type Inquiry, type Status } from "@/lib/types";

export default function Inquiries({ initial }: { initial: Inquiry[] }) {
  const [list, setList] = useState(initial);
  const [q, setQ] = useState(""); const [st, setSt] = useState("All"); const [ty, setTy] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return list.filter((i) => (st === "All" || i.status === st) && (ty === "All" || i.type === ty) &&
      (!t || [i.id, i.customer.name, i.customer.email, i.customer.phone, ...i.items.map((x) => x.name + x.productId)].join(" ").toLowerCase().includes(t)));
  }, [list, q, st, ty]);

  const patch = async (id: string, body: { status?: Status; adminNotes?: string }) => {
    const r = await fetch(`/api/admin/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) return setMsg("Could not save change.");
    const { inquiry } = await r.json(); setList((l) => l.map((x) => (x.id === id ? inquiry : x))); setMsg("Saved.");
  };

  return (
    <div>
      <div className="mb-5 grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
        <div><label className="label" htmlFor="iq">Search</label><input id="iq" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Reference, name, email, product…" /></div>
        <div><label className="label" htmlFor="is">Status</label><select id="is" className="input" value={st} onChange={(e) => setSt(e.target.value)}><option>All</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="label" htmlFor="it">Type</label><select id="it" className="input" value={ty} onChange={(e) => setTy(e.target.value)}><option value="All">All</option><option value="order">Order requests</option><option value="custom">Custom designs</option></select></div>
        <a href="/api/admin/inquiries?format=csv" className="btn-outline">Export CSV</a>
      </div>
      <p className="mb-3 text-sm text-cocoa/60" aria-live="polite">{shown.length} inquiries {msg && `· ${msg}`}</p>
      {shown.length === 0 && <p className="py-10 text-center text-cocoa/60">No inquiries found.</p>}
      <ul className="space-y-3">
        {shown.map((i) => (
          <li key={i.id} className="border border-blush bg-white">
            <button className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left" aria-expanded={open === i.id} onClick={() => setOpen(open === i.id ? null : i.id)}>
              <span><strong className="font-serif text-lg text-rose">{i.id}</strong> <span className="ml-2 text-xs uppercase tracking-widest text-cocoa/50">{i.type === "custom" ? "Custom" : "Order"}</span><br /><span className="text-sm">{i.customer.name} · {new Date(i.createdAt).toLocaleString()}</span></span>
              <span className={`px-3 py-1 text-xs ${i.status === "New Inquiry" ? "bg-rose text-white" : "bg-champagne"}`}>{i.status}</span>
            </button>
            {open === i.id && (
              <div className="grid gap-6 border-t border-blush p-5 text-sm md:grid-cols-2">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg">Customer</h3>
                  <p>{i.customer.name}</p><p><a className="text-rose underline" href={`mailto:${i.customer.email}`}>{i.customer.email}</a></p><p><a className="text-rose underline" href={`tel:${i.customer.phone}`}>{i.customer.phone}</a></p>
                  <p>Prefers: {i.customer.contactMethod || "—"}</p><p>Ship to: {[i.customer.city, i.customer.state, i.customer.country].filter(Boolean).join(", ") || "—"}</p>
                  <p className="pt-2 text-xs text-cocoa/55">Emails — business: {i.emailStatus.business}; customer: {i.emailStatus.customer}</p>
                </div>
                <div>
                  <h3 className="font-serif text-lg">{i.type === "custom" ? "Custom design" : "Items"}</h3>
                  {i.items.map((it, n) => <p key={n} className="mt-1">{it.name} <span className="text-cocoa/50">({it.productId})</span> × {it.quantity}<br /><span className="text-cocoa/70">{[it.metal, it.size && `Size ${it.size}`, it.gemstone, it.customization && `Note: ${it.customization}`].filter(Boolean).join(" · ")}</span></p>)}
                  {i.custom && <div className="space-y-1"><p>Type: {i.custom.jewelryType}</p><p>Metal: {i.custom.metal || "—"} · Gemstone: {i.custom.gemstone || "—"} · Budget: {i.custom.budget || "—"}</p><p className="whitespace-pre-wrap">{i.custom.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">{i.custom.referenceImages.map((r) => <a key={r} href={`/api/admin/ref/${r.replace("ref:", "")}`} target="_blank" rel="noopener noreferrer">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={`/api/admin/ref/${r.replace("ref:", "")}`} alt="Reference" className="h-20 w-20 object-cover" /></a>)}</div></div>}
                  {i.instructions && <p className="mt-3"><strong>Instructions:</strong> {i.instructions}</p>}
                  {i.notes && <p className="mt-1"><strong>Notes:</strong> {i.notes}</p>}
                </div>
                <div className="md:col-span-2 grid gap-4 sm:grid-cols-[1fr_2fr]">
                  <div><label className="label" htmlFor={`st-${i.id}`}>Status</label><select id={`st-${i.id}`} className="input" value={i.status} onChange={(e) => patch(i.id, { status: e.target.value as Status })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
                  <div><label className="label" htmlFor={`an-${i.id}`}>Internal notes (never shown to customer)</label><textarea id={`an-${i.id}`} className="input" rows={3} defaultValue={i.adminNotes ?? ""} maxLength={4000} onBlur={(e) => e.target.value !== (i.adminNotes ?? "") && patch(i.id, { adminNotes: e.target.value })} /></div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
