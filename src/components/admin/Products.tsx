"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, METALS, type Product } from "@/lib/types";
import { slugify } from "@/lib/format";

const blank = (): Product => ({ id: "", slug: "", name: "", category: "Rings", description: "", materials: "", gemstone: "", price: null, showPrice: false, sizes: [], metals: [], gemstoneOptions: [], customization: true, images: [], available: true, isNew: true, bestSeller: false, featured: false, placeholder: false, createdAt: "" });
const csv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function Products({ initial }: { initial: Product[] }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [edit, setEdit] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);

  const refresh = async () => { const r = await fetch("/api/admin/products"); setList((await r.json()).products); router.refresh(); };
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!edit) return; setBusy(true); setErr("");
    const r = await fetch(isNew ? "/api/admin/products" : `/api/admin/products/${edit.id}`, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(edit) });
    if (!r.ok) setErr((await r.json().catch(() => ({}))).error ?? "Could not save."); else { setEdit(null); await refresh(); }
    setBusy(false);
  };
  const del = async (p: Product) => { if (confirm(`Delete “${p.name}” permanently?`)) { await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" }); await refresh(); } };
  const toggle = async (p: Product) => { await fetch(`/api/admin/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, available: !p.available }) }); await refresh(); };
  const upload = async (files: FileList | null) => {
    if (!files || !edit) return; setErr("");
    for (const f of Array.from(files)) {
      const fd = new FormData(); fd.set("file", f);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd }); const d = await r.json();
      if (!r.ok) { setErr(d.error ?? "Upload failed"); break; }
      setEdit((p) => p && { ...p, images: [...p.images, d.url], placeholder: false });
    }
  };
  const up = <K extends keyof Product>(k: K, v: Product[K]) => setEdit((p) => p && { ...p, [k]: v });

  if (edit) return (
    <form onSubmit={save} className="grid gap-5 border border-blush bg-white p-6 sm:grid-cols-2">
      <h2 className="text-2xl sm:col-span-2">{isNew ? "Add product" : `Edit ${edit.name}`}</h2>
      <div><label className="label" htmlFor="p-name">Name</label><input id="p-name" required className="input" value={edit.name} onChange={(e) => { up("name", e.target.value); if (isNew) up("slug", slugify(e.target.value)); }} /></div>
      <div><label className="label" htmlFor="p-id">SKU / ID</label><input id="p-id" required disabled={!isNew} pattern="[A-Za-z0-9\-_]+" className="input disabled:opacity-60" value={edit.id} onChange={(e) => up("id", e.target.value)} /></div>
      <div><label className="label" htmlFor="p-slug">URL slug</label><input id="p-slug" required pattern="[a-z0-9\-]+" className="input" value={edit.slug} onChange={(e) => up("slug", e.target.value)} /></div>
      <div><label className="label" htmlFor="p-cat">Category</label><select id="p-cat" className="input" value={edit.category} onChange={(e) => up("category", e.target.value as Product["category"])}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="p-desc">Description</label><textarea id="p-desc" required rows={4} className="input" value={edit.description} onChange={(e) => up("description", e.target.value)} /></div>
      <div><label className="label" htmlFor="p-mat">Materials</label><input id="p-mat" className="input" value={edit.materials} onChange={(e) => up("materials", e.target.value)} /></div>
      <div><label className="label" htmlFor="p-gem">Gemstone information</label><input id="p-gem" className="input" value={edit.gemstone} onChange={(e) => up("gemstone", e.target.value)} /></div>
      <div><label className="label" htmlFor="p-price">Price (USD, optional)</label><input id="p-price" type="number" min="0" step="1" className="input" value={edit.price ?? ""} onChange={(e) => up("price", e.target.value === "" ? null : Number(e.target.value))} /></div>
      <label className="flex items-center gap-2 self-end pb-3 text-sm"><input type="checkbox" className="accent-[#B76E62]" checked={edit.showPrice} onChange={(e) => up("showPrice", e.target.checked)} />Display price on website</label>
      <div><label className="label" htmlFor="p-sizes">Sizes (comma-separated; empty = none)</label><input id="p-sizes" className="input" defaultValue={edit.sizes.join(", ")} onBlur={(e) => up("sizes", csv(e.target.value))} /></div>
      <div><label className="label" htmlFor="p-go">Gemstone options (comma-separated)</label><input id="p-go" className="input" defaultValue={edit.gemstoneOptions.join(", ")} onBlur={(e) => up("gemstoneOptions", csv(e.target.value))} /></div>
      <fieldset className="sm:col-span-2"><legend className="label">Available metals (only checked options are shown to customers)</legend><div className="flex flex-wrap gap-5">{METALS.map((m) => <label key={m} className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#B76E62]" checked={edit.metals.includes(m)} onChange={(e) => up("metals", e.target.checked ? [...edit.metals, m] : edit.metals.filter((x) => x !== m))} />{m}</label>)}</div></fieldset>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm sm:col-span-2">
        {([["available", "In stock / available"], ["customization", "Allow customization notes"], ["isNew", "New arrival"], ["bestSeller", "Best seller"], ["featured", "Featured"], ["placeholder", "Mark as sample/placeholder"]] as const).map(([k, l]) => <label key={k} className="flex items-center gap-2"><input type="checkbox" className="accent-[#B76E62]" checked={edit[k]} onChange={(e) => up(k, e.target.checked)} />{l}</label>)}
      </div>
      <div className="sm:col-span-2"><label className="label" htmlFor="p-img">Images (first image is the main one)</label>
        <input id="p-img" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(e) => upload(e.target.files)} className="input !p-2.5" />
        <ul className="mt-3 flex flex-wrap gap-3">{edit.images.map((s, i) => <li key={s + i} className="relative">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={s} alt="" className="h-24 w-20 object-cover" />
          <div className="mt-1 flex justify-between text-xs"><button type="button" disabled={i === 0} onClick={() => up("images", [s, ...edit.images.filter((_, j) => j !== i)])} className="text-rose disabled:opacity-30">★ main</button><button type="button" onClick={() => up("images", edit.images.filter((_, j) => j !== i))} aria-label="Remove image" className="text-rose">✕</button></div></li>)}</ul></div>
      {err && <p role="alert" className="text-sm text-rose-dark sm:col-span-2">{err}</p>}
      <div className="flex gap-3 sm:col-span-2"><button className="btn" disabled={busy || edit.images.length === 0}>{busy ? "Saving…" : "Save product"}</button><button type="button" className="btn-outline" onClick={() => setEdit(null)}>Cancel</button>{edit.images.length === 0 && <span className="self-center text-xs text-cocoa/60">Add at least one image</span>}</div>
    </form>
  );

  return (
    <div>
      <button className="btn mb-6" onClick={() => { setEdit(blank()); setIsNew(true); setErr(""); }}>+ Add product</button>
      <div className="overflow-x-auto border border-blush bg-white"><table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-champagne/60 text-xs uppercase tracking-widest"><tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Availability</th><th className="p-3" /></tr></thead>
        <tbody>{list.map((p) => <tr key={p.id} className="border-t border-blush">
          <td className="p-3"><div className="flex items-center gap-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.images[0]} alt="" className="h-12 w-10 object-cover" /><span><strong>{p.name}</strong><br /><span className="text-xs text-cocoa/50">{p.id}{p.placeholder && " · sample"}</span></span></div></td>
          <td className="p-3">{p.category}</td><td className="p-3">{p.price != null ? `$${p.price}${p.showPrice ? "" : " (hidden)"}` : "—"}</td>
          <td className="p-3"><button onClick={() => toggle(p)} className={`px-3 py-1 text-xs ${p.available ? "bg-champagne" : "bg-cocoa text-white"}`}>{p.available ? "Available" : "Unavailable"}</button></td>
          <td className="space-x-3 p-3 text-right"><button className="text-rose underline" onClick={() => { setEdit(p); setIsNew(false); setErr(""); }}>Edit</button><button className="text-cocoa/60 underline" onClick={() => del(p)}>Delete</button></td></tr>)}</tbody></table></div>
      <p className="mt-4 text-xs text-cocoa/55">Categories are fixed to the eight shop categories; assign each product to one. Product pages and the shop update immediately after saving.</p>
    </div>
  );
}
