"use client";
import { useState } from "react";
import { SITE } from "@/lib/site";

/** Logo slot. Drop your logo at public/logo.svg (or change SITE.logo). Falls back to a text wordmark if the file fails to load. */
export default function Logo({ className = "h-12 sm:h-16" }: { className?: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return <span className="font-serif text-2xl uppercase tracking-[0.2em] text-rose">{SITE.name}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={SITE.logo} alt={`${SITE.name} — ${SITE.tagline}`} className={`${className} w-auto object-contain transition-all duration-300`} onError={() => setBroken(true)} />;
}
