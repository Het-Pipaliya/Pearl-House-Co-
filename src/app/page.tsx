import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";
import { CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

const catImg: Record<string, string> = { Rings: "ring", "Engagement Rings": "engagement", Necklaces: "necklace", Pendants: "pendant", Bracelets: "bracelet", Earrings: "earrings", "Wedding Bands": "band", "Custom Jewelry": "custom" };
const why = [["Personal service", "A dedicated team member guides your request from start to finish."], ["Made to order", "Pieces are produced by skilled independent manufacturing partners."], ["Customizable", "Choose metals, sizes and gemstones, or begin a bespoke design."], ["No payment online", "We confirm details and arrangements with you personally first."]];

function Row({ title, eyebrow, items, href }: { title: string; eyebrow: string; items: Awaited<ReturnType<typeof getProducts>>; href: string }) {
  if (!items.length) return null;
  return (
    <section className="container-x py-16">
      <header className="mb-10 text-center"><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 text-4xl sm:text-5xl">{title}</h2></header>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7">{items.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      <div className="mt-10 text-center"><Link href={href} className="btn-outline">View All</Link></div>
    </section>
  );
}

export default async function Home() {
  const all = (await getProducts()).filter((p) => p.available);
  return (
    <>
      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] overflow-hidden bg-blush">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/placeholders/hero.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory/95 via-ivory/40 to-transparent sm:bg-gradient-to-r sm:from-ivory/90 sm:via-ivory/55" />
          <div className="container-x relative flex h-full items-end pb-14 sm:items-center sm:pb-0">
            <div className="reveal max-w-xl">
              <p className="eyebrow">Pearl House &amp; Co · Fine Jewelry</p>
              <h1 className="mt-5 text-5xl leading-[1.05] sm:text-7xl">Timeless Elegance, Beautifully Crafted</h1>
              <p className="mt-6 max-w-md text-lg text-cocoa/80">Discover exceptional jewelry designed to celebrate life&apos;s most precious moments.</p>
              <Link href="/shop" className="btn mt-9">Explore Collections</Link>
            </div>
          </div>
        </div>
        <p className="bg-champagne/70 py-2 text-center text-[11px] uppercase tracking-[0.18em] text-cocoa/60">Imagery shown is placeholder artwork until real photography is added</p>
      </section>

      <section className="container-x py-20">
        <header className="mb-10 text-center"><p className="eyebrow">Collections</p><h2 className="mt-2 text-4xl sm:text-5xl">Shop by Category</h2></header>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {CATEGORIES.map((c) => (
            <li key={c}><Link href={`/shop?category=${encodeURIComponent(c)}`} className="group block">
              <div className="aspect-square overflow-hidden bg-blush/40">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={`/placeholders/${catImg[c]}-${c === "Rings" || c === "Pendants" ? 2 : 1}.svg`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
              <p className="mt-3 text-center font-serif text-xl group-hover:text-rose">{c}</p>
            </Link></li>
          ))}
        </ul>
      </section>

      <Row eyebrow="Just In" title="New Arrivals" items={all.filter((p) => p.isNew)} href="/shop?sort=newest" />
      <div className="bg-white"><Row eyebrow="Most Loved" title="Best Sellers" items={all.filter((p) => p.bestSeller)} href="/shop" /></div>
      <Row eyebrow="Curated" title="Featured Pieces" items={all.filter((p) => p.featured)} href="/shop" />

      <section className="bg-blush/50 py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/placeholders/custom-2.svg" alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          <div><p className="eyebrow">Custom Jewelry</p><h2 className="mt-3 text-4xl sm:text-5xl">Your Vision. Our Craftsmanship.</h2>
            <p className="mt-5 text-cocoa/80">Have a design in mind? Share your ideas and inspiration with us. Our team will work with you and our manufacturing partners to explore what&apos;s possible.</p>
            <Link href="/custom" className="btn mt-8">Begin Your Design</Link></div>
        </div>
      </section>

      <section className="container-x grid items-center gap-12 py-24 lg:grid-cols-2">
        <div><p className="eyebrow">Our Story</p><h2 className="mt-3 text-4xl sm:text-5xl">Jewelry, personally arranged</h2>
          <p className="mt-5 text-cocoa/80">Pearl House &amp; Co pairs a thoughtfully curated collection with a personal, unhurried service. We work with skilled independent manufacturers to bring each piece to life — and we guide you every step of the way.</p>
          <Link href="/about" className="link-u mt-6 inline-block text-rose">Read our story →</Link></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/placeholders/story.svg" alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
      </section>

      <section className="bg-white py-20"><div className="container-x"><h2 className="mb-12 text-center text-4xl sm:text-5xl">Why Choose Pearl House &amp; Co</h2>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">{why.map(([t, d]) => <li key={t} className="text-center"><div className="mx-auto mb-4 h-px w-10 bg-rose" /><h3 className="text-2xl">{t}</h3><p className="mt-2 text-sm text-cocoa/70">{d}</p></li>)}</ul></div></section>

      <section className="container-x py-24 text-center"><h2 className="text-4xl sm:text-5xl">Let&apos;s find something extraordinary</h2><p className="mx-auto mt-4 max-w-xl text-cocoa/75">Send us an order request or ask a question. No payment is needed — we&apos;ll be in touch personally.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4"><Link href="/shop" className="btn">Browse Jewelry</Link><Link href="/contact" className="btn-outline">Contact Us</Link></div></section>
    </>
  );
}
