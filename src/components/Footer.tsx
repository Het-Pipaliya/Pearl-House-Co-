import Link from "next/link";
import { SITE } from "@/lib/site";
import Logo from "./Logo";

const col = (title: string, links: [string, string][]) => (
  <div>
    <h3 className="mb-4 font-sans text-[11px] uppercase tracking-luxe text-rose">{title}</h3>
    <ul className="space-y-2.5 text-sm text-cocoa/80">{links.map(([l, h]) => <li key={l}><Link href={h} className="link-u hover:text-rose">{l}</Link></li>)}</ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-blush bg-white">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div><Logo className="h-14" /><p className="mt-5 max-w-xs text-sm leading-relaxed text-cocoa/70">Fine jewelry, personally arranged. Every request is reviewed by our team and made with our skilled manufacturing partners.</p></div>
        {col("Shop", [["All Jewelry", "/shop"], ["Engagement Rings", "/shop?category=Engagement%20Rings"], ["Wedding Bands", "/shop?category=Wedding%20Bands"], ["Necklaces", "/shop?category=Necklaces"], ["Earrings", "/shop?category=Earrings"]])}
        {col("Client Care", [["Custom Jewelry", "/custom"], ["Contact Us", "/contact"], ["Shipping Information", "/shipping"], ["Custom Order Policy", "/custom-order-policy"], ["Our Story", "/about"]])}
        <div>
          <h3 className="mb-4 font-sans text-[11px] uppercase tracking-luxe text-rose">Connect</h3>
          <ul className="space-y-2.5 text-sm text-cocoa/80">
            <li>{SITE.email}</li><li>{SITE.phone}</li>
            {SITE.social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="link-u hover:text-rose">{s.label}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-blush/70">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-cocoa/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="flex gap-5"><Link href="/privacy" className="hover:text-rose">Privacy Policy</Link><Link href="/terms" className="hover:text-rose">Terms &amp; Conditions</Link></p>
        </div>
      </div>
    </footer>
  );
}
