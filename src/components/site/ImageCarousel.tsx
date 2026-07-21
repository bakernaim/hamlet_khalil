"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

// Lightweight image carousel (CSS + state, no libs). Shows a single image with
// prev/next arrows and dot indicators when there is more than one. `images`
// should already include the cover as its first entry.
export default function ImageCarousel({
  images,
  alt,
  sizes,
  className = "",
  imageClassName = "",
}: {
  images: string[];
  alt: string;
  sizes?: string;
  // The root must be a sized, positioned box (e.g. "relative h-36" or
  // "absolute inset-0") — the fill image positions against it.
  className?: string;
  imageClassName?: string;
}) {
  const { isRTL } = useLang();
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;
  const safe = Math.min(index, images.length - 1);
  const multiple = images.length > 1;

  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + images.length) % images.length);

  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        key={images[safe]}
        src={images[safe]}
        alt={alt}
        fill
        className={`object-cover ${imageClassName}`}
        sizes={sizes ?? "100vw"}
      />

      {multiple && (
        <>
          {/* Fixed physical sides so the glyph always matches its action,
              regardless of the page's RTL/LTR direction. */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label={isRTL ? "السابق" : "Previous"}
            className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 rounded-full bg-black/45 text-white/90 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-lg leading-none"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label={isRTL ? "التالي" : "Next"}
            className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 rounded-full bg-black/45 text-white/90 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-lg leading-none"
          >
            ›
          </button>

          <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                aria-label={`${isRTL ? "صورة" : "Image"} ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === safe ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
