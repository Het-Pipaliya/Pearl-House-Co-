import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Our Story", description: "Pearl House & Co brings thoughtfully selected fine jewelry and personal service to life's meaningful moments." };

const values = [["Passion for fine jewelry", "We love jewelry that marks a moment and is worn for years to come."], ["Timeless design", "Clean lines and enduring silhouettes, chosen to outlast trends."], ["Personalized service", "A real person guides every request, from first message to delivery."], ["Attention to detail", "We review each piece and every option with care before it is placed."]];
export default function About() {
  return (
    <div>
      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2">
        <div><p className="eyebrow">Our Story</p><h1 className="mt-3 text-5xl sm:text-6xl">Jewelry for the moments that matter</h1>
          <div className="mt-6 space-y-4 text-cocoa/80"><p>Pearl House &amp; Co was founded on a simple idea: choosing fine jewelry should feel personal, unhurried and beautiful.</p>
            <p>We curate timeless designs and work with skilled independent manufacturing partners who make each piece to order. We are not a workshop and we don&apos;t claim to be — our role is to guide you, coordinate every detail, and make sure the piece that arrives is the one you imagined.</p>
            <p>Whether it&apos;s an engagement, an anniversary, or a gift that simply says thank you, we&apos;re here to help you celebrate it.</p></div></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/placeholders/story.svg" alt="Placeholder illustration of a pearl bracelet" className="aspect-[4/5] w-full object-cover" />
      </section>
      <section className="bg-white py-20"><div className="container-x"><h2 className="mb-12 text-center text-4xl">What we value</h2><ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">{values.map(([t, d]) => <li key={t} className="text-center"><h3 className="text-2xl text-rose">{t}</h3><p className="mt-3 text-sm text-cocoa/75">{d}</p></li>)}</ul></div></section>
      <section className="container-x py-20 text-center"><h2 className="text-4xl">Our partners</h2><p className="mx-auto mt-4 max-w-2xl text-cocoa/75">We collaborate with independent jewelry manufacturers whose craftsmanship we trust. This lets us offer a wide range of designs and customization while keeping the experience personal.</p><Link href="/custom" className="btn mt-8">Start a Custom Design</Link></section>
    </div>
  );
}
