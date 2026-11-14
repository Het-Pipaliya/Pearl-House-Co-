"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { useCart } from "./CartProvider";
import { HeartIcon } from "./Icons";

export const needsOptions = (p: Product) => p.sizes.length > 0 || p.metals.length > 0;

export default function ProductCard({ p, i = 0, reveal = true }: { p: Product; i?: number; reveal?: boolean }) {
  const { wishlist, toggleWish, add } = useCart();
  const [added, setAdded] = useState(false);
  const wished = wishlist.includes(p.id);
  const quick = () => {
    add({ productId: p.id, name: p.name, slug: p.slug, image: p.images[0] ?? "", quantity: 1 });
    setAdded(true); setTimeout(() => setAdded(false), 1800);
  };
  return (
    <article className={`${reveal ? "rv " : ""}group transition-transform duration-500 hover:-translate-y-1.5`} style={{ "--i": i % 4 } as React.CSSProperties}>
      <div className="relative aspect-[4/3] overflow-hidden bg-blush/40 shadow-[0_0_0_rgba(73,48,43,0)] transition-shadow duration-500 group-hover:shadow-[0_18px_40px_-18px_rgba(73,48,43,0.35)]">
        <Link href={`/shop/${p.slug}`} aria-label={p.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]" />
          {p.images[1] && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.images[1]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
        </Link>
        <button onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`} className="absolute right-3 top-3 rounded-full bg-white/85 p-2 text-rose transition hover:bg-white"><HeartIcon filled={wished} /></button>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 text-[10px] uppercase tracking-[0.16em]">
          {p.isNew && <span className="bg-white/90 px-2 py-1 text-rose">New</span>}
          {p.bestSeller && <span className="bg-white/90 px-2 py-1 text-rose">Best Seller</span>}
          {!p.available && <span className="bg-cocoa px-2 py-1 text-white">Unavailable</span>}
        </div>
      </div>
      <div className="pt-4 text-center">
        <p className="eyebrow">{p.category}</p>
        <h3 className="mt-1 text-xl"><Link href={`/shop/${p.slug}`} className="hover:text-rose">{p.name}</Link></h3>
        <p className="mx-auto mt-1 line-clamp-2 max-w-xs text-sm text-cocoa/65">{p.description}</p>
        {p.showPrice && p.price != null && <p className="mt-2 text-sm">{money(p.price)}</p>}
        <div className="mt-4">
          {!p.available ? <Link href={`/contact?product=${encodeURIComponent(p.name)}`} className="btn-outline !px-5 !py-2.5">Ask About This Piece</Link>
            : needsOptions(p) ? <Link href={`/shop/${p.slug}`} className="btn-outline !px-5 !py-2.5">Select Options</Link>
            : <button onClick={quick} className="btn !px-5 !py-2.5" aria-live="polite">{added ? "Added ✓" : "Add to Cart"}</button>}
        </div>
      </div>
    </article>
  );
}
