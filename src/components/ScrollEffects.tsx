"use client";
import { useEffect, useRef } from "react";

/**
 * Scroll effects, all disabled for visitors who prefer reduced motion:
 *  - elements with class `rv` fade/slide in as they enter the viewport (stagger with style --i)
 *  - a thin rose progress line under the header
 *  - gentle parallax on the hero image (element with [data-parallax])
 */
export default function ScrollEffects() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("js"); // from here on, `.rv` elements start hidden

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); }
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    const scan = () => document.querySelectorAll<HTMLElement>(".rv:not(.rv-in):not([data-rv])").forEach((el) => { el.dataset.rv = "1"; io.observe(el); });
    scan();
    const mo = new MutationObserver(scan); // pages/filters that render new cards later
    mo.observe(document.body, { childList: true, subtree: true });

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY, max = root.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
        const hero = document.querySelector<HTMLElement>("[data-parallax]");
        if (hero && window.innerWidth >= 768 && y < 900) hero.style.transform = `translate3d(0, ${y * 0.12}px, 0) scale(1.08)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); mo.disconnect(); window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); root.classList.remove("js"); };
  }, []);

  return <div ref={bar} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] origin-left scale-x-0 bg-rose" />;
}
