import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Words from "@/components/Words";
import HeroCollage from "@/components/HeroCollage";
import { getProducts } from "@/lib/db";
import { CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

const catImg: Record<string, string> = { Rings: "catalog/tile-rings", "Engagement Rings": "catalog/tile-engagement-rings", Necklaces: "catalog/tile-necklaces", Pendants: "catalog/tile-pendants", Bracelets: "catalog/tile-bracelets", Earrings: "catalog/tile-earrings", "Wedding Bands": "catalog/tile-wedding-bands", "Custom Jewelry": "homepage/home-05" };
const why = [["Personal service", "A dedicated team member guides your request from start to finish."], ["Made to order", "Pieces are produced by skilled independent manufacturing partners."], ["Customizable", "Choose metals, sizes and gemstones, or begin a bespoke design."], ["No payment online", "We confirm details and arrangements with you personally first."]];

function Row({ title, eyebrow, items, href }: { title: string; eyebrow: string; items: Awaited<ReturnType<typeof getProducts>>; href: string }) {
  if (!items.length) return null;
  return (
    <section className="container-x py-16">
      <header className="rv mb-10 text-center"><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 text-4xl sm:text-5xl">{title}</h2></header>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7">{items.slice(0, 4).map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
      <div className="rv mt-10 text-center"><Link href={href} className="btn-outline">View All</Link></div>
    </section>
  );
}

export default async function Home() {
  const all = (await getProducts()).filter((p) => p.available);
  return (
    <>
      <HeroCollage />

      <section className="bg-ivory px-5 pt-20 text-center sm:pt-28">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Pearl House &amp; Co · Fine Jewelry</p>
          <h1 className="mt-5 text-balance text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">Your Dream Jewelry, Made Real.</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cocoa/80">Choose from our collection or share your own design. We’ll create the jewelry just the way you want it.</p>
          <Link href="/shop" className="btn mt-9">Explore Collections</Link>
        </div>
      </section>


      <section className="container-x py-24 sm:py-32">
        <p className="eyebrow mb-6 text-center">How we work</p>
        <Words className="mx-auto max-w-4xl text-center font-serif text-3xl leading-[1.2] text-cocoa sm:text-5xl lg:text-6xl" text="Every piece begins with a conversation. Choose from our collection, or share a design of your own — and we’ll bring it to life, together." />
      </section>

      <section className="container-x pb-20">
        <header className="rv mb-10 text-center"><p className="eyebrow">Collections</p><h2 className="mt-2 text-4xl sm:text-5xl">Shop by Category</h2></header>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {CATEGORIES.map((c) => (
            <li key={c} className="rv" style={{ "--i": CATEGORIES.indexOf(c) % 4 } as React.CSSProperties}><Link href={`/shop?category=${encodeURIComponent(c)}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-blush/40"><div data-fx="parallax" data-speed={CATEGORIES.indexOf(c) % 2 ? "0.06" : "0.1"} className="-my-[9%] h-[118%]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={`/images/${catImg[c]}.webp`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]" /></div></div>
              <p className="mt-3 text-center font-serif text-xl group-hover:text-rose">{c}</p>
            </Link></li>
          ))}
        </ul>
      </section>

      <Row eyebrow="Just In" title="New Arrivals" items={all.filter((p) => p.isNew)} href="/shop?sort=newest" />
      <div className="bg-white"><Row eyebrow="Most Loved" title="Best Sellers" items={all.filter((p) => p.bestSeller)} href="/shop" /></div>
      {(() => { const feat = all.filter((p) => p.featured).slice(0, 6); return feat.length > 0 && (
        <section data-fx="hscroll" className="hs-outer bg-white">
          <div className="hs-sticky py-16 md:py-0">
            <header className="hs-head container-x mb-10 flex items-end justify-between gap-6">
              <div><p className="eyebrow">Curated</p><h2 className="mt-2 text-4xl sm:text-5xl">Featured Pieces</h2></div>
              <Link href="/shop" className="link-u hidden text-sm text-rose sm:block">View all →</Link>
            </header>
            <div className="hs-track">{feat.map((p) => <div key={p.id} className="hs-card"><ProductCard p={p} reveal={false} /></div>)}</div>
            <div aria-hidden className="container-x mt-6 hidden md:block"><div className="h-px w-full bg-blush"><div data-hs-progress className="h-px origin-left scale-x-0 bg-rose" /></div></div>
          </div>
        </section>
      ); })()}

      <section className="bg-blush/50 py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/homepage/home-06.webp" alt="Ring design sketches beside a rose-gold ring" loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <div data-fx="steps" className="space-y-14 lg:space-y-[15vh] lg:pb-[6vh] lg:pt-[3vh]">
            <div data-step>
              <p className="eyebrow">Custom Jewelry</p><h2 className="mt-3 text-4xl sm:text-5xl">Your Vision. Our Craftsmanship.</h2>
              <p className="mt-5 max-w-md text-cocoa/80">Have a design in mind? Share your ideas and inspiration with us. Our team will work with you and our manufacturing partners to explore what&apos;s possible.</p>
            </div>
            {[["Choose", "Browse the collection and pick the pieces and options you love."], ["Submit a request", "Send your order request. No payment is taken online."], ["Personal consultation", "Our team contacts you to confirm availability, details and pricing."], ["Confirm & make", "Once agreed, your piece is made to order by our manufacturing partner."], ["Delivery", "Your finished jewelry is shipped to you."]].map(([t, d], i) => (
              <div key={t} data-step className="flex gap-6">
                <span className="font-serif text-6xl leading-none text-rose sm:text-7xl">{i + 1}</span>
                <div><h3 className="text-2xl sm:text-3xl">{t}</h3><p className="mt-2 max-w-sm text-cocoa/75">{d}</p></div>
              </div>
            ))}
            <div data-step><Link href="/custom" className="btn">Begin Your Design</Link></div>
          </div>
        </div>
      </section>

      <section className="container-x grid items-center gap-12 py-24 lg:grid-cols-2">
        <div className="rv rv-l"><p className="eyebrow">Our Story</p><h2 className="mt-3 text-4xl sm:text-5xl">Jewelry, personally arranged</h2>
          <p className="mt-5 text-cocoa/80">Pearl House &amp; Co pairs a thoughtfully curated collection with a personal, unhurried service. We work with skilled independent manufacturers to bring each piece to life — and we guide you every step of the way.</p>
          <Link href="/about" className="link-u mt-6 inline-block text-rose">Read our story →</Link></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div data-fx="grow" className="overflow-hidden"><img src="/images/homepage/home-07.webp" alt="A pearl necklace beside a blush ring box" loading="lazy" className="aspect-square w-full object-cover" /></div>
      </section>

      <section className="bg-white py-20"><div className="container-x"><h2 className="mb-12 text-center text-4xl sm:text-5xl">Why Choose Pearl House &amp; Co</h2>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">{why.map(([t, d]) => <li key={t} className="rv text-center" style={{ "--i": why.findIndex((w) => w[0] === t) } as React.CSSProperties}><div className="mx-auto mb-4 h-px w-10 bg-rose transition-all duration-500 hover:w-20" /><h3 className="text-2xl">{t}</h3><p className="mt-2 text-sm text-cocoa/70">{d}</p></li>)}</ul></div></section>

      <section className="rv container-x py-24 text-center"><h2 className="text-4xl sm:text-5xl">Let&apos;s find something extraordinary</h2><p className="mx-auto mt-4 max-w-xl text-cocoa/75">Send us an order request or ask a question. No payment is needed — we&apos;ll be in touch personally.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4"><Link href="/shop" className="btn">Browse Jewelry</Link><Link href="/contact" className="btn-outline">Contact Us</Link></div></section>
    </>
  );
}
