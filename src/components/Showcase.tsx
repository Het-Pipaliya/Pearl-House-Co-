"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Featured pieces as a normal horizontal row: swipe, trackpad, keyboard (Tab) or the arrow buttons. Never hijacks page scrolling. */
export default function Showcase({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = row.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setP(max > 0 ? el.scrollLeft / max : 0);
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
  }, []);
  useEffect(() => { update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update); }, [update]);

  const go = (dir: 1 | -1) => { const el = row.current; if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" }); };
  const btn = "flex h-11 w-11 items-center justify-center border border-blush bg-white text-rose transition hover:border-rose hover:bg-rose hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <section className="bg-white py-16 md:py-24" aria-label={title}>
      <header className="container-x mb-10 flex items-end justify-between gap-6">
        <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 text-4xl sm:text-5xl">{title}</h2></div>
        <div className="hidden gap-2 md:flex">
          <button type="button" className={btn} onClick={() => go(-1)} disabled={edge.start} aria-label="Previous pieces">←</button>
          <button type="button" className={btn} onClick={() => go(1)} disabled={edge.end} aria-label="Next pieces">→</button>
        </div>
      </header>
      <div ref={row} onScroll={update} className="showcase-row" tabIndex={-1}>{children}</div>
      <div aria-hidden className="container-x mt-8"><div className="h-px w-full bg-blush"><div className="h-px origin-left bg-rose transition-transform duration-150" style={{ transform: `scaleX(${Math.max(p, 0.04)})` }} /></div></div>
    </section>
  );
}
