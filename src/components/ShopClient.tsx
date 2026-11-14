"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, METALS, type Product } from "@/lib/types";
import ProductCard from "./ProductCard";

const SORTS = { featured: "Featured", newest: "Newest", "price-asc": "Price: Low to High", "price-desc": "Price: High to Low", name: "Name A–Z" } as const;
type SortKey = keyof typeof SORTS;

export default function ShopClient({ products, wishlistOnly = false }: { products: Product[]; wishlistOnly?: boolean }) {
  const sp = useSearchParams();
  // The URL is the single source of truth for category and search, so header links
  // (e.g. Wedding Bands → Engagement) always change the grid, even when already on /shop.
  const urlCat = sp.get("category") ?? "All";
  const cat = (CATEGORIES as readonly string[]).includes(urlCat) ? urlCat : "All";
  const urlQ = sp.get("q") ?? "";
  const [q, setQ] = useState(urlQ);
  useEffect(() => setQ(urlQ), [urlQ]);
  const [metal, setMetal] = useState("All");
  const [sort, setSort] = useState<SortKey>(((s) => (s && s in SORTS ? s : "featured") as SortKey)(sp.get("sort")));
  const [avail, setAvail] = useState(false);

  const counts = useMemo(() => { const c: Record<string, number> = {}; for (const p of products) c[p.category] = (c[p.category] ?? 0) + 1; return c; }, [products]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const r = products.filter((p) =>
      (cat === "All" || p.category === cat) && (metal === "All" || p.metals.includes(metal as never)) && (!avail || p.available) &&
      (!t || [p.name, p.description, p.category, p.materials, p.gemstone, p.id].join(" ").toLowerCase().includes(t)));
    const priced = (p: Product) => p.price ?? Infinity;
    return [...r].sort((a, b) => sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : sort === "price-asc" ? priced(a) - priced(b) : sort === "price-desc" ? (b.price ?? -1) - (a.price ?? -1) : sort === "name" ? a.name.localeCompare(b.name) : Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller) || b.createdAt.localeCompare(a.createdAt));
  }, [products, q, cat, metal, sort, avail]);

  const chip = (active: boolean) => `block whitespace-nowrap border px-3.5 py-2 text-[11px] sm:px-4 sm:text-[12px] uppercase tracking-[0.14em] transition-all duration-300 ${active ? "border-rose bg-rose text-white" : "border-blush bg-white hover:-translate-y-0.5 hover:border-rose hover:text-rose"}`;

  return (
    <div>
      {!wishlistOnly && (
        <nav aria-label="Categories" className="mb-8">
          <ul className="flex flex-wrap justify-center gap-2">
            <li><Link scroll={false} href="/shop" aria-current={cat === "All" ? "page" : undefined} className={chip(cat === "All")}>All ({products.length})</Link></li>
            {CATEGORIES.filter((c) => counts[c]).map((c) => (
              <li key={c}><Link scroll={false} href={`/shop?category=${encodeURIComponent(c)}`} aria-current={cat === c ? "page" : undefined} className={chip(cat === c)}>{c} ({counts[c]})</Link></li>
            ))}
          </ul>
        </nav>
      )}
      <div className="mb-8 grid gap-3 border-y border-blush py-5 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
        <div><label className="label" htmlFor="s-q">Search</label><input id="s-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="input" placeholder="Name, material, gemstone…" /></div>
        <div><label className="label" htmlFor="s-m">Metal</label><select id="s-m" value={metal} onChange={(e) => setMetal(e.target.value)} className="input"><option>All</option>{METALS.map((m) => <option key={m}>{m}</option>)}</select></div>
        <div><label className="label" htmlFor="s-s">Sort by</label><select id="s-s" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="input">{Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <label className="flex items-center gap-2 pb-3 text-sm"><input type="checkbox" checked={avail} onChange={(e) => setAvail(e.target.checked)} className="accent-[#B76E62]" />Available only</label>
      </div>
      <p className="mb-6 text-sm text-cocoa/60" aria-live="polite">{cat !== "All" && <strong className="font-medium text-cocoa">{cat} · </strong>}{list.length} {list.length === 1 ? "piece" : "pieces"}</p>
      {list.length === 0 ? <p className="py-20 text-center text-cocoa/70">No pieces match your search. Try clearing a filter.</p> :
        <div key={`${cat}|${q}|${metal}|${sort}|${avail}`} className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-7">{list.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>}
    </div>
  );
}
