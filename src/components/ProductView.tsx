"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { useCart } from "./CartProvider";
import { HeartIcon } from "./Icons";

export default function ProductView({ p }: { p: Product }) {
  const { add, wishlist, toggleWish } = useCart();
  const [img, setImg] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [light, setLight] = useState(false);
  const [size, setSize] = useState("");
  const [metal, setMetal] = useState(p.metals.length === 1 ? p.metals[0] : "");
  const [gem, setGem] = useState(p.gemstoneOptions.length === 1 ? p.gemstoneOptions[0] : "");
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const [added, setAdded] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const move = (e: React.MouseEvent) => { const r = box.current!.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); };
  const submit = () => {
    if (p.sizes.length && !size) return setErr("Please choose a size.");
    if (p.metals.length && !metal) return setErr("Please choose a metal.");
    setErr("");
    add({ productId: p.id, name: p.name, slug: p.slug, image: p.images[0] ?? "", quantity: qty, size: size || undefined, metal: metal || undefined, gemstone: gem || undefined, customization: note.trim() || undefined });
    setAdded(true); setTimeout(() => setAdded(false), 2500);
  };
  const wished = wishlist.includes(p.id);
  const chip = (active: boolean) => `border px-4 py-2 text-sm transition ${active ? "border-rose bg-rose text-white" : "border-blush bg-white hover:border-rose"}`;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <div ref={box} onMouseMove={move} onMouseLeave={() => setZoom(null)} onClick={() => setLight(true)} className="relative aspect-[3/2] cursor-zoom-in overflow-hidden bg-blush/40" role="button" tabIndex={0} aria-label="Open enlarged image" onKeyDown={(e) => e.key === "Enter" && setLight(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[img]} alt={p.name} className="h-full w-full object-cover transition-transform duration-200" style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
        </div>
        {p.images.length > 1 && (
          <ul className="mt-3 grid grid-cols-4 gap-3">
            {p.images.map((s, i) => <li key={s + i}><button onClick={() => setImg(i)} aria-label={`Show image ${i + 1}`} aria-current={i === img} className={`block aspect-square w-full overflow-hidden border ${i === img ? "border-rose" : "border-transparent"}`}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={s} alt="" className="h-full w-full object-cover" /></button></li>)}
          </ul>
        )}
      </div>

      <div className="lg:pt-4">
        <p className="eyebrow">{p.category}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{p.name}</h1>
        {p.placeholder && <p className="mt-3 inline-block bg-champagne px-3 py-1 text-[11px] uppercase tracking-[0.14em]">Sample product · placeholder</p>}
        {p.showPrice && p.price != null ? <p className="mt-4 text-xl">{money(p.price)}</p> : <p className="mt-4 text-sm text-cocoa/60">Pricing confirmed by our team after your request</p>}
        <p className="mt-6 leading-relaxed text-cocoa/80">{p.description}</p>
        <dl className="mt-6 space-y-2 border-y border-blush py-5 text-sm">
          {p.materials && <div className="flex gap-4"><dt className="w-28 shrink-0 text-cocoa/60">Materials</dt><dd>{p.materials}</dd></div>}
          {p.gemstone && <div className="flex gap-4"><dt className="w-28 shrink-0 text-cocoa/60">Gemstone</dt><dd>{p.gemstone}</dd></div>}
        </dl>

        {p.available ? (
          <div className="mt-6 space-y-6">
            {p.metals.length > 0 && <fieldset><legend className="label">Metal {metal && <span className="normal-case tracking-normal text-cocoa">— {metal}</span>}</legend><div className="flex flex-wrap gap-2">{p.metals.map((m) => <button type="button" key={m} onClick={() => setMetal(m)} aria-pressed={metal === m} className={chip(metal === m)}>{m}</button>)}</div></fieldset>}
            {p.sizes.length > 0 && <fieldset><legend className="label">Size</legend><div className="flex flex-wrap gap-2">{p.sizes.map((s) => <button type="button" key={s} onClick={() => setSize(s)} aria-pressed={size === s} className={`${chip(size === s)} min-w-12`}>{s}</button>)}</div></fieldset>}
            {p.gemstoneOptions.length > 0 && <div><label className="label" htmlFor="gem">Gemstone</label><select id="gem" value={gem} onChange={(e) => setGem(e.target.value)} className="input"><option value="">No preference</option>{p.gemstoneOptions.map((g) => <option key={g}>{g}</option>)}</select></div>}
            {p.customization && <div><label className="label" htmlFor="note">Customization requests (optional)</label><textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={3} className="input" placeholder="Engraving text, stone size, special requests…" /></div>}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-blush bg-white" role="group" aria-label="Quantity">
                <button type="button" className="px-4 py-3" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span className="w-8 text-center" aria-live="polite">{qty}</span>
                <button type="button" className="px-4 py-3" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>+</button>
              </div>
              <button className="btn flex-1" onClick={submit}>{added ? "Added to Cart ✓" : "Add to Cart"}</button>
              <button onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label="Toggle wishlist" className="border border-blush bg-white p-3.5 text-rose hover:border-rose"><HeartIcon filled={wished} /></button>
            </div>
            {err && <p role="alert" className="text-sm text-rose-dark">{err}</p>}
            {added && <p className="text-sm"><Link href="/cart" className="text-rose underline">View cart &amp; submit order request</Link></p>}
          </div>
        ) : <p className="mt-6 border border-blush bg-white p-4 text-sm">This piece is currently unavailable. Contact us to ask about similar designs.</p>}

        <Link href={`/contact?product=${encodeURIComponent(p.name)}`} className="btn-outline mt-5 w-full">Request More Information</Link>
        <p className="mt-6 text-xs leading-relaxed text-cocoa/60">All orders are subject to availability and final confirmation by our team. Submitting a request does not require payment.</p>
      </div>

      {light && (
        <div role="dialog" aria-modal="true" aria-label="Enlarged image" className="fixed inset-0 z-[70] flex items-center justify-center bg-cocoa/80 p-4" onClick={() => setLight(false)}>
          <button className="absolute right-5 top-5 text-3xl text-white" aria-label="Close" onClick={() => setLight(false)}>×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[img]} alt={p.name} className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
