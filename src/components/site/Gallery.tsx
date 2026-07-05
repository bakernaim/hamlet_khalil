"use client";

// Trip gallery: admin-uploaded photos and short clips, shown as a grid with a
// simple lightbox (arrow/swipe-free — prev/next buttons + Escape).

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import type { GalleryItemDTO } from "@/lib/types";

const PREVIEW_COUNT = 8;

export default function Gallery({ items }: { items: GalleryItemDTO[] }) {
  const { isRTL } = useLang();
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  if (items.length === 0) return null;

  const visible = showAll ? items : items.slice(0, PREVIEW_COUNT);
  const caption = (g: GalleryItemDTO) => (isRTL ? g.captionAr : g.captionEn) || "";

  return (
    <section id="gallery" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "معرض الرحلات" : "Gallery"}
          </span>
          {/* h2 → Reem Kufi */}
          <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3">
            {isRTL ? "لحظات من رحلاتنا" : "Moments From Our Trips"}
          </h2>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {visible.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActive(i)}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-line bg-card focus:outline-none focus:ring-2 focus:ring-brand/50"
              aria-label={caption(g) || (g.type === "video" ? "video" : "photo")}
            >
              {g.type === "video" ? (
                <>
                  <video
                    src={g.src}
                    preload="metadata"
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="w-12 h-12 rounded-full bg-black/55 backdrop-blur-sm text-white grid place-items-center text-lg transition-transform group-hover:scale-110">
                      ▶
                    </span>
                  </span>
                </>
              ) : (
                <Image
                  src={g.src}
                  alt={caption(g)}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {caption(g) && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent text-white text-[11px] px-3 pt-6 pb-2 text-start opacity-0 group-hover:opacity-100 transition-opacity">
                  {caption(g)}
                </span>
              )}
            </button>
          ))}
        </div>

        {!showAll && items.length > PREVIEW_COUNT && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-sm font-semibold px-5 py-2.5 rounded-full border border-line text-soft hover:text-ink hover:border-brand/40 transition"
            >
              {isRTL ? `عرض الكل (${items.length})` : `Show all (${items.length})`}
            </button>
          </div>
        )}
      </div>

      {active !== null && (
        <Lightbox
          items={items}
          index={active}
          onIndex={setActive}
          onClose={() => setActive(null)}
          caption={caption}
          isRTL={isRTL}
        />
      )}
    </section>
  );
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
  caption,
  isRTL,
}: {
  items: GalleryItemDTO[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  caption: (g: GalleryItemDTO) => string;
  isRTL: boolean;
}) {
  const item = items[index];
  const prev = () => onIndex((index - 1 + items.length) % items.length);
  const next = () => onIndex((index + 1) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  });

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={caption(item) || "gallery"}
    >
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
        {item.type === "video" ? (
          // key forces a reload when navigating between videos
          <video key={item.id} src={item.src} controls autoPlay playsInline className="max-h-[78vh] max-w-full rounded-2xl" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={item.id} src={item.src} alt={caption(item)} className="max-h-[78vh] max-w-full rounded-2xl object-contain" />
        )}
        {caption(item) && (
          <p dir={isRTL ? "rtl" : "ltr"} className="text-white/80 text-sm mt-3 text-center">
            {caption(item)}
          </p>
        )}
        {items.length > 1 && (
          <div className="text-white/40 text-xs mt-1">{index + 1} / {items.length}</div>
        )}
      </div>

      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl leading-none"
      >
        ×
      </button>
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
