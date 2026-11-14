import type { Metadata } from "next";
import ShopClient from "@/components/ShopClient";
import { getProducts } from "@/lib/db";
import { CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: { category?: string } }): Promise<Metadata> {
  const c = (CATEGORIES as readonly string[]).includes(searchParams.category ?? "") ? searchParams.category! : null;
  return {
    title: c ? `${c} — Fine Jewelry` : "Shop All Fine Jewelry",
    description: `Browse ${c ? c.toLowerCase() : "rings, engagement rings, necklaces, pendants, bracelets, earrings and wedding bands"} from Pearl House & Co. Submit an order request — no online payment.`,
  };
}

// The category/search come from the URL and are read on the server, so the full product grid is in the page HTML (good for SEO and no loading flash).
export default async function Shop({ searchParams }: { searchParams: { category?: string; q?: string; sort?: string } }) {
  const products = await getProducts();
  const cat = (CATEGORIES as readonly string[]).includes(searchParams.category ?? "") ? searchParams.category! : "All";
  return (
    <div className="container-x py-14">
      <header className="mb-10 text-center"><p className="eyebrow">The Collection</p><h1 className="mt-3 text-5xl">{cat === "All" ? "Shop All" : cat}</h1><p className="mx-auto mt-4 max-w-xl text-cocoa/70">Select the pieces you love and submit an order request. Our team will confirm availability, pricing and details with you personally.</p></header>
      <ShopClient products={products} category={cat} initialQuery={(searchParams.q ?? "").slice(0, 80)} initialSort={searchParams.sort} />
    </div>
  );
}
