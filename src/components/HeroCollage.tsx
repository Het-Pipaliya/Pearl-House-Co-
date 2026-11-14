"use client";
import { useEffect, useRef } from "react";

/**
 * Scroll-controlled editorial collage (GSAP ScrollTrigger, scrubbed — never plays by itself):
 *   0  only the main model, large and centred
 *   1  main model glides to its place on the left; earrings slide in from the right
 *   2  bracelets slide in from the bottom-right
 *   3  centre portrait rises from the bottom and overlaps the others
 * The section is pinned while this happens; scrolling back up reverses it. Without JS, or with
 * "reduce motion", the finished collage is simply shown.
 */
export default function HeroCollage() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current; if (!el) return;
    el.style.setProperty("--rest-top", `${Math.round(el.getBoundingClientRect().top + window.scrollY)}px`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // static final collage
    let revert: (() => void) | undefined; let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true }); // iOS Safari: the collapsing address bar must not re-run the animation

      const mm = gsap.matchMedia();
      mm.add({ desk: "(min-width: 768px)", mob: "(max-width: 767px)" }, (ctx) => {
        const desk = !!ctx.conditions?.desk;
        const q = (s: string) => el.querySelector<HTMLElement>(s)!;
        const [main, ear, brace, mid, cue] = [".c-main", ".c-ear", ".c-brace", ".c-mid", ".c-cue"].map(q);

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: el, start: () => `top ${document.querySelector("header")?.getBoundingClientRect().height ?? (desk ? 112 : 56)}px`, /* = height of the sticky header */ end: () => `+=${Math.round(window.innerHeight * (desk ? 2.9 : 2.5))}`,
            pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
          },
        });
        // main model: starts large in the middle of the stage, then moves to its final place
        tl.fromTo(main, desk ? { xPercent: 69, scale: 1.1 } : { yPercent: 25.8, scale: 1.12 }, { xPercent: 0, yPercent: 0, scale: 1, duration: 1.4, ease: "power2.inOut" }, 0)
          .fromTo(cue, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25, ease: "none" }, 0)
          // earrings: gently from the right
          .fromTo(ear, { xPercent: desk ? 70 : 100, autoAlpha: 0, scale: 0.96 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 1.3 }, 0.7)
          // bracelets: from the bottom-right
          .fromTo(brace, { xPercent: 45, yPercent: 70, autoAlpha: 0, scale: 0.96 }, { xPercent: 0, yPercent: 0, autoAlpha: 1, scale: 1, duration: 1.3 }, 1.7)
          // centre portrait: rises from the bottom and overlaps
          .fromTo(mid, { yPercent: 90, autoAlpha: 0, scale: 0.94 }, { yPercent: 0, autoAlpha: 1, scale: 1, duration: 1.4 }, 2.8)
          .to({}, { duration: 0.8 }); // brief hold so the finished collage settles before the page scrolls on

        el.classList.add("is-ready");
        return () => { el.classList.remove("is-ready"); };
      });
      revert = () => mm.revert();
    })();

    return () => { cancelled = true; revert?.(); };
  }, []);

  return (
    <section ref={root} aria-label="Pearl House & Co jewelry editorial" className="collage relative overflow-hidden bg-ivory">
      <noscript><style>{`.collage .c-sec{opacity:1!important}.collage .c-main{transform:none!important}`}</style></noscript>
      <div className="absolute inset-0 p-3 md:p-5">
        <div className="relative h-full w-full overflow-hidden">
          {/* main model */}
          <figure className="c-main absolute left-0 top-0 z-[1] h-[calc(66%+1px)] w-full overflow-hidden md:h-full md:w-[calc(42%+1px)]" style={{ willChange: "transform" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero/main-model.webp" alt="Model in ivory satin wearing pearl earrings, a pearl necklace, a pearl bracelet and a ring" width={1192} height={1320} fetchPriority="high" className="h-full w-full object-cover object-[50%_22%]" />
          </figure>
          {/* earrings, top right */}
          <figure className="c-ear c-sec absolute left-0 top-[66%] z-[2] h-[34%] w-1/2 overflow-hidden md:left-[42%] md:top-0 md:h-[calc(60%+1px)] md:w-[58%]" style={{ willChange: "transform, opacity" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero/earrings.jpg" alt="Close-up of a gold hoop earring and gold rings" width={606} height={465} className="h-full w-full object-cover object-[50%_30%]" />
          </figure>
          {/* bracelets, bottom right */}
          <figure className="c-brace c-sec absolute left-1/2 top-[66%] z-[2] h-[34%] w-1/2 overflow-hidden md:left-[66%] md:top-[60%] md:h-[40%] md:w-[34%]" style={{ willChange: "transform, opacity" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero/bracelets.jpg" alt="Hand wearing gold bangles and a diamond ring resting on stone" width={444} height={420} className="h-full w-full object-cover object-[50%_55%]" />
          </figure>
          {/* centre portrait, overlapping */}
          <figure className="c-mid c-sec absolute left-[28%] top-[44%] z-[3] h-[44%] w-[44%] overflow-hidden shadow-[0_30px_70px_-34px_rgba(73,48,43,0.38)] md:left-[34%] md:top-[36%] md:h-[64%] md:w-[32%]" style={{ willChange: "transform, opacity" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero/center-model.jpg" alt="Model in a silk camisole wearing layered gold necklaces and hoop earrings" width={345} height={469} className="h-full w-full object-cover object-[50%_25%]" />
          </figure>
          {/* scroll cue, fades as soon as the animation starts */}
          <div aria-hidden className="c-cue pointer-events-none absolute inset-x-0 bottom-5 z-[4] flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cocoa/80">
            <span>Scroll</span><span className="block h-8 w-px bg-cocoa/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
