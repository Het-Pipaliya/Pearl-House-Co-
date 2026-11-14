import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductView from "@/components/ProductView";
import { getProductBySlug, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProductBySlug(params.slug);
  return p ? { title: p.name, description: p.description.slice(0, 155), openGraph: { images: p.images[0] ? [p.images[0]] : [] } } : {};
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProductBySlug(params.slug);
  if (!p) notFound();
  const related = (await getProducts()).filter((x) => x.id !== p.id && x.category === p.category).concat((await getProducts()).filter((x) => x.id !== p.id && x.category !== p.category)).slice(0, 4);
  const ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, sku: p.id, image: p.images, ...(p.showPrice && p.price != null ? { offers: { "@type": "Offer", price: p.price, priceCurrency: "USD", availability: p.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } } : {}) };
  return (
    <div className="container-x py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <ProductView p={p} />
      <section className="mt-24"><h2 className="mb-10 text-center text-3xl">You May Also Love</h2><div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div></section>
    </div>
  );
}
