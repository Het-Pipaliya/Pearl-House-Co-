"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import Logo from "./Logo";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "./Icons";

const NAV = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=Engagement%20Rings", label: "Engagement" },
  { href: "/shop?category=Wedding%20Bands", label: "Wedding Bands" },
  { href: "/custom", label: "Custom Jewelry" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { count, wishlist } = useCart();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { const f = () => setScrolled(window.scrollY > 40); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), setSearching(false)); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);

  const go = (e: React.FormEvent) => { e.preventDefault(); router.push(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop"); setSearching(false); setOpen(false); };

  return (
    <header className="sticky top-0 z-40 border-b border-blush/70 bg-ivory/95 backdrop-blur">
      <div className="container-x grid grid-cols-[1fr_auto_1fr] items-center py-2 sm:py-3">
        <div className="flex items-center">
          <button className="p-2 lg:hidden" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><MenuIcon /></button>
          <button className="hidden p-2 text-cocoa hover:text-rose lg:block" aria-label="Search" onClick={() => setSearching((s) => !s)}><SearchIcon /></button>
        </div>
        <Link href="/" aria-label="Pearl House & Co — home" className="justify-self-center"><Logo className={scrolled ? "h-14 sm:h-16" : "h-16 sm:h-24"} /></Link>
        <div className="flex items-center justify-end gap-1">
          <button className="p-2 hover:text-rose lg:hidden" aria-label="Search" onClick={() => setSearching((s) => !s)}><SearchIcon /></button>
          <Link href="/wishlist" className="relative p-2 hover:text-rose" aria-label={`Wishlist, ${wishlist.length} items`}><HeartIcon />{wishlist.length > 0 && <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-rose" />}</Link>
          <Link href="/cart" className="relative p-2 hover:text-rose" aria-label={`Cart, ${count} items`}><BagIcon />{count > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] text-white">{count}</span>}</Link>
        </div>
      </div>
      <nav aria-label="Main" className="hidden border-t border-blush/50 lg:block">
        <ul className="container-x flex justify-center gap-10 py-3">
          {NAV.map((n) => <li key={n.label}><Link href={n.href} className="link-u text-[12px] uppercase tracking-[0.2em] text-cocoa hover:text-rose">{n.label}</Link></li>)}
        </ul>
      </nav>
      {searching && (
        <form onSubmit={go} role="search" className="border-t border-blush/60 bg-white">
          <div className="container-x flex gap-3 py-3"><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} className="input" placeholder="Search jewelry, e.g. “pearl earrings”" aria-label="Search products" /><button className="btn">Search</button></div>
        </form>
      )}
      {open && (
        <div className="fixed inset-0 z-50 bg-ivory lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between border-b border-blush px-5 py-4"><Logo className="h-10" /><button className="p-2" aria-label="Close menu" onClick={() => setOpen(false)}><CloseIcon /></button></div>
          <ul className="px-6 py-6">
            {NAV.map((n) => <li key={n.label} className="border-b border-blush/60"><Link href={n.href} onClick={() => setOpen(false)} className="block py-4 font-serif text-2xl">{n.label}</Link></li>)}
            <li className="border-b border-blush/60"><Link href="/wishlist" onClick={() => setOpen(false)} className="block py-4 font-serif text-2xl">Wishlist</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
