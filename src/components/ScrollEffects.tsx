"use client";
import { useEffect, useRef } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Sideways pan speed vs. scrolling: 1 = one screen of scrolling per screen of panning. <1 pans faster, so the section is passed sooner. */
const PAN_PACE = 0.5;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Scroll-driven effects (all skipped when the visitor prefers reduced motion — the page then simply reads top to bottom):
 *  .rv                  fade/slide in when entering the viewport (stagger with style --i)
 *  top progress line    thin rose line showing page progress
 *  [data-parallax]      hero image drifts slower than the page
 *  [data-fx=hero-text]  hero copy lifts and fades as you scroll away
 *  [data-fx=parallax]   (data-speed) element drifts relative to the viewport centre
 *  [data-fx=grow]       image scales up from a rounded card to full size as it enters
 *  [data-fx=words]      words light up one by one as the paragraph scrolls into view
 *  [data-fx=steps]      children [data-step] come into focus as they reach the centre of the screen
 *  [data-fx=hscroll]    vertical scrolling pans a row of cards sideways (desktop), swipeable row on phones
 */
export default function ScrollEffects() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("js", "fx");

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); }
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    type Lists = { hero: HTMLElement[]; par: HTMLElement[]; grow: HTMLElement[]; words: HTMLElement[]; steps: HTMLElement[]; hs: HTMLElement[]; heroImg: HTMLElement | null };
    let L: Lists = { hero: [], par: [], grow: [], words: [], steps: [], hs: [], heroImg: null };
    const q = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s));
    const desktop = () => window.innerWidth >= 768;

    const sizeHscroll = () => {
      for (const el of L.hs) {
        const track = el.querySelector<HTMLElement>(".hs-track"); if (!track) continue;
        const sticky = el.querySelector<HTMLElement>(".hs-sticky");
        if (!desktop() || !sticky) { el.style.height = ""; track.style.transform = ""; continue; }
        // pinned for exactly as long as it takes to pan the row: section height = pan distance + the pinned panel's own height
        el.style.height = `${Math.max(track.scrollWidth - window.innerWidth, 0) * PAN_PACE + sticky.offsetHeight}px`;
      }
    };
    const collect = () => {
      document.querySelectorAll<HTMLElement>(".rv:not(.rv-in):not([data-rv])").forEach((el) => { el.dataset.rv = "1"; io.observe(el); });
      L = { hero: q("[data-fx=hero-text]"), par: q("[data-fx=parallax]"), grow: q("[data-fx=grow]"), words: q("[data-fx=words]"), steps: q("[data-fx=steps]"), hs: q("[data-fx=hscroll]"), heroImg: document.querySelector("[data-parallax]") };
      sizeHscroll();
    };

    const update = () => {
      const y = window.scrollY, H = window.innerHeight, max = root.scrollHeight - H, wide = desktop();
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      if (L.heroImg && wide && y < H) L.heroImg.style.transform = `translate3d(0, ${y * 0.12}px, 0) scale(${1.08 + y * 0.00012})`;
      for (const el of L.hero) { const p = clamp(y / (H * 0.7)); el.style.transform = `translate3d(0, ${-p * 70}px, 0)`; el.style.opacity = String(1 - p * 0.95); }

      for (const el of L.par) {
        const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > H + 200) continue;
        const speed = Number(el.dataset.speed ?? 0.08); const off = (r.top + r.height / 2 - H / 2) * speed;
        el.style.transform = `translate3d(0, ${-off}px, 0)`;
      }
      for (const el of L.grow) {
        const r = el.getBoundingClientRect(); if (r.bottom < -100 || r.top > H + 100) continue;
        const p = ease(clamp((H - r.top) / (H * 0.9)));
        el.style.transform = `scale(${0.8 + 0.2 * p})`; el.style.borderRadius = `${(1 - p) * 44}px`; el.style.opacity = String(0.35 + 0.65 * p);
      }
      for (const el of L.words) {
        const r = el.getBoundingClientRect(); const ws = el.querySelectorAll<HTMLElement>(".w"); if (!ws.length) continue;
        const p = clamp((H * 0.88 - r.top) / (H * 0.5 + r.height * 0.5));
        ws.forEach((w, i) => { w.style.opacity = String(0.16 + 0.84 * clamp(p * (ws.length + 6) - i, 0, 1)); });
      }
      if (wide) for (const el of L.steps) {
        for (const s of Array.from(el.querySelectorAll<HTMLElement>("[data-step]"))) {
          const r = s.getBoundingClientRect(); const d = clamp(Math.abs(r.top + r.height / 2 - H * 0.5) / (H * 0.45));
          s.style.opacity = String(1 - 0.72 * ease(d)); s.style.transform = `translate3d(0, ${d * 18}px, 0) scale(${1 - d * 0.03})`;
        }
      }
      if (wide) for (const el of L.hs) {
        const track = el.querySelector<HTMLElement>(".hs-track"); if (!track) continue;
        const sticky = el.querySelector<HTMLElement>(".hs-sticky"); if (!sticky) continue;
        const r = el.getBoundingClientRect(); const pinTop = parseFloat(getComputedStyle(sticky).top) || 0;
        const dist = Math.max(track.scrollWidth - window.innerWidth, 0); if (dist <= 0) continue;
        const p = clamp((pinTop - r.top) / (dist * PAN_PACE));
        track.style.transform = `translate3d(${-p * dist}px, 0, 0)`;
        const fill = el.querySelector<HTMLElement>("[data-hs-progress]"); if (fill) fill.style.transform = `scaleX(${p})`;
      }
    };

    // Keyboard users: tabbing to a card that is currently panned off-screen scrolls the page so the card slides into view.
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null; const card = t?.closest<HTMLElement>(".hs-card"); const outer = card?.closest<HTMLElement>("[data-fx=hscroll]");
      if (!card || !outer || !desktop()) return;
      const track = outer.querySelector<HTMLElement>(".hs-track"); const sticky = outer.querySelector<HTMLElement>(".hs-sticky"); if (!track || !sticky) return;
      sticky.scrollLeft = 0; // browsers may try to scroll the clipped panel itself
      const dist = Math.max(track.scrollWidth - window.innerWidth, 0); if (dist <= 0) return;
      const want = clamp(card.offsetLeft - (window.innerWidth - card.offsetWidth) / 2, 0, dist);
      const pinTop = parseFloat(getComputedStyle(sticky).top) || 0; const secTop = outer.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: secTop - pinTop + (want / dist) * dist * PAN_PACE, behavior: "instant" });
    };
    document.addEventListener("focusin", onFocus);
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
    const onResize = () => { sizeHscroll(); onScroll(); };
    let mt = 0; const mo = new MutationObserver(() => { cancelAnimationFrame(mt); mt = requestAnimationFrame(() => { collect(); onScroll(); }); });
    mo.observe(document.body, { childList: true, subtree: true });
    collect(); update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    return () => {
      io.disconnect(); mo.disconnect(); document.removeEventListener("focusin", onFocus); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); window.removeEventListener("load", onResize);
      cancelAnimationFrame(raf); cancelAnimationFrame(mt); root.classList.remove("js", "fx");
    };
  }, []);

  return <div ref={bar} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] origin-left scale-x-0 bg-rose" />;
}
