"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, METALS, type Product } from "@/lib/types";
import ProductCard from "./ProductCard";

const SORTS = { featured: "Featured", newest: "Newest", "price-asc": "Price: Low to High", "price-desc": "Price: High to Low", name: "Name A–Z" } as const;

export default function ShopClient({ products, wishlistOnly = false }: { products: Product[]; wishlistOnly?: boolean }) {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [cat, setCat] = useState(sp.get("category") ?? "All");
  const [metal, setMetal] = useState("All");
  const [sort, setSort] = useState<keyof typeof SORTS>(((s) => (s && s in SORTS ? s : "featured") as keyof typeof SORTS)(sp.get("sort")));
  const [avail, setAvail] = useState(false);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    let r = products.filter((p) =>
      (cat === "All" || p.category === cat) && (metal === "All" || p.metals.includes(metal as never)) && (!avail || p.available) &&
      (!t || [p.name, p.description, p.category, p.materials, p.gemstone, p.id].join(" ").toLowerCase().includes(t)));
    const priced = (p: Product) => p.price ?? Infinity;
    r = [...r].sort((a, b) => sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : sort === "price-asc" ? priced(a) - priced(b) : sort === "price-desc" ? (b.price ?? -1) - (a.price ?? -1) : sort === "name" ? a.name.localeCompare(b.name) : Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller));
    return r;
  }, [products, q, cat, metal, sort, avail]);

  return (
    <div>
      <div className="mb-8 grid gap-3 border-y border-blush py-5 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-end">
        <div><label className="label" htmlFor="s-q">Search</label><input id="s-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="input" placeholder="Name, material, gemstone…" /></div>
        {!wishlistOnly && <div><label className="label" htmlFor="s-c">Category</label><select id="s-c" value={cat} onChange={(e) => setCat(e.target.value)} className="input"><option>All</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>}
        <div><label className="label" htmlFor="s-m">Metal</label><select id="s-m" value={metal} onChange={(e) => setMetal(e.target.value)} className="input"><option>All</option>{METALS.map((m) => <option key={m}>{m}</option>)}</select></div>
        <div><label className="label" htmlFor="s-s">Sort by</label><select id="s-s" value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className="input">{Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <label className="flex items-center gap-2 pb-3 text-sm"><input type="checkbox" checked={avail} onChange={(e) => setAvail(e.target.checked)} className="accent-[#B76E62]" />Available only</label>
      </div>
      <p className="mb-6 text-sm text-cocoa/60" aria-live="polite">{list.length} {list.length === 1 ? "piece" : "pieces"}</p>
      {list.length === 0 ? <p className="py-20 text-center text-cocoa/70">No pieces match your search. Try clearing a filter.</p> :
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-7">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </div>
  );
}
