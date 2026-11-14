"use client";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import ProductCard from "./ProductCard";

export default function WishlistView({ products }: { products: Product[] }) {
  const { wishlist, ready } = useCart();
  if (!ready) return <p className="py-20 text-center text-cocoa/60">Loading…</p>;
  const list = products.filter((p) => wishlist.includes(p.id));
  if (!list.length) return <div className="py-20 text-center"><p className="mb-6 text-cocoa/70">Your wishlist is empty. Tap the heart on any piece to save it here.</p><Link href="/shop" className="btn">Explore Collections</Link></div>;
  return <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7">{list.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>;
}
