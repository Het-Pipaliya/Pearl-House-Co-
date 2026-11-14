import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "@/components/ShopClient";
import { getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shop All Fine Jewelry", description: "Browse rings, engagement rings, necklaces, pendants, bracelets, earrings and wedding bands from Pearl House & Co." };

export default async function Shop() {
  const products = await getProducts();
  return (
    <div className="container-x py-14">
      <header className="mb-10 text-center"><p className="eyebrow">The Collection</p><h1 className="mt-3 text-5xl">Shop All</h1><p className="mx-auto mt-4 max-w-xl text-cocoa/70">Select the pieces you love and submit an order request. Our team will confirm availability, pricing and details with you personally.</p></header>
      <Suspense fallback={null}><ShopClient products={products} /></Suspense>
    </div>
  );
}
