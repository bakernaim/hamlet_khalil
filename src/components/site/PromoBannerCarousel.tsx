"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import PromoBanner from "@/components/site/PromoBanner";
import type { BannerDTO } from "@/lib/types";

// Thin promo bar pinned to the bottom of the viewport as an overlay. With more
// than one banner it auto-advances (pausing on hover) as a snap-scrolling
// carousel with dot indicators, and can be dismissed. Geometry uses
// getBoundingClientRect deltas so it behaves the same in LTR and RTL.
export default function PromoBannerCarousel({
  banners,
  whatsappNumber,
}: {
  banners: BannerDTO[];
  whatsappNumber: string;
}) {
  const { isRTL } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [closing, setClosing] = useState(false); // drives the slide-down exit
  const [dismissed, setDismissed] = useState(false);
  const count = banners.length;

  // Centre slide `i` by nudging the track's scroll by the measured offset.
  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    const delta = child.getBoundingClientRect().left - el.getBoundingClientRect().left;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  // Auto-advance while more than one banner and not hovered.
  useEffect(() => {
    if (count < 2 || paused) return;
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % count;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [count, paused]);

  // Keep the active dot in sync when the user swipes/scrolls the track.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || count < 2) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        const center = box.left + box.width / 2;
        let best = 0;
        let bestDist = Infinity;
        Array.from(el.children).forEach((ch, i) => {
          const r = ch.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setIndex(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [count]);

  const dismiss = () => {
    setClosing(true);
    // Let the slide-down finish before unmounting.
    setTimeout(() => setDismissed(true), 450);
  };

  if (count === 0 || dismissed) return null;

  const go = (i: number) => {
    const n = (i + count) % count;
    setIndex(n);
    scrollToIndex(n);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out ${
        closing ? "translate-y-full" : "promo-slide-up"
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label={isRTL ? "عرض ترويجي" : "Promotion"}
    >
      <div className="relative">
        <div
          ref={trackRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-16 sm:h-[68px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {banners.map((b) => (
            <div key={b.id} className="w-full shrink-0 snap-center">
              <PromoBanner banner={b} whatsappNumber={whatsappNumber} />
            </div>
          ))}
        </div>

        {/* Close — kept on the left so it never sits under the WhatsApp FAB (bottom-right). */}
        <button
          type="button"
          onClick={dismiss}
          aria-label={isRTL ? "إغلاق" : "Dismiss"}
          className="absolute top-1/2 -translate-y-1/2 left-1.5 z-10 grid place-items-center w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Dot indicators */}
        {count > 1 && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {banners.map((b, i) => (
              <button
                type="button"
                key={b.id}
                onClick={() => go(i)}
                aria-label={`${isRTL ? "الشريحة" : "Slide"} ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
