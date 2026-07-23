"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import type { InstagramPostDTO, SectionCopy } from "@/lib/types";

// Static fallback shown when no live Instagram feed is configured/available.
const FALLBACK_ITEMS = [
  { src: "/shrines/hussain-karbala.jpg",  label: { ar: "ضريح الإمام الحسين — كربلاء", en: "Imam Hussain Shrine — Karbala" } },
  { src: "/shrines/ali-najaf.jpg",        label: { ar: "ضريح الإمام علي — النجف",      en: "Imam Ali Shrine — Najaf" } },
  { src: "/shrines/reza-mashhad.jpg",     label: { ar: "ضريح الإمام الرضا — مشهد",     en: "Imam Reza Shrine — Mashhad" } },
  { src: "/shrines/zaynab-damascus.jpg",  label: { ar: "ضريح السيدة زينب — دمشق",      en: "Sayyida Zaynab Shrine — Damascus" } },
  { src: "/shrines/arbaeen-crowd.jpg",    label: { ar: "مسيرة الأربعين الكبرى",         en: "Grand Arbaeen March" } },
  { src: "/shrines/turkey-istanbul.jpg",  label: { ar: "رحلة إسطنبول",                  en: "Istanbul Trip" } },
];

export default function InstagramFeed({
  instagramUrl,
  items = [],
  copy,
}: {
  instagramUrl: string;
  items?: InstagramPostDTO[];
  copy: SectionCopy;
}) {
  const { isRTL } = useLang();
  const live = items.length > 0;

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative py-16 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-page-alt" />
      <div className="absolute inset-0 pattern-overlay opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="ig-g" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f09433"/>
                  <stop offset="25%" stopColor="#e6683c"/>
                  <stop offset="50%" stopColor="#dc2743"/>
                  <stop offset="75%" stopColor="#cc2366"/>
                  <stop offset="100%" stopColor="#bc1888"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-g)" strokeWidth="2"/>
              <circle cx="12" cy="12" r="5" stroke="url(#ig-g)" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-g)"/>
            </svg>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              {isRTL ? copy.titleAr : copy.titleEn}
            </h2>
          </div>
          {(isRTL ? copy.descAr : copy.descEn) && (
            <p className="text-muted max-w-md mx-auto text-sm leading-relaxed mb-2">
              {isRTL ? copy.descAr : copy.descEn}
            </p>
          )}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-semibold text-sm hover:text-brand dark:hover:text-[#4dffa0] transition-colors"
          >
            @{instagramUrl.split("/").filter(Boolean).pop()}
          </a>
        </div>

        {/* 6-photo grid: live Instagram posts when configured, else fallback. */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mb-8 max-w-3xl mx-auto">
          {live
            ? items.map((item) => {
                const caption = (isRTL ? item.captionAr : item.captionEn) || item.captionEn || item.captionAr || "";
                const Tag = item.permalink ? "a" : "div";
                return (
                  <Tag
                    key={item.id}
                    {...(item.permalink
                      ? { href: item.permalink, target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand/50 transition-all block"
                  >
                    <Image
                      src={item.image}
                      alt={caption || "Instagram post"}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 130px"
                    />
                    {caption && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-white text-xs font-medium leading-snug line-clamp-3">{caption}</p>
                      </div>
                    )}
                    <div className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-7 h-7 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <InstagramGlyph className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </Tag>
                );
              })
            : FALLBACK_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand/50 transition-all"
                >
                  <Image
                    src={item.src}
                    alt={isRTL ? item.label.ar : item.label.en}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 130px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-xs font-medium leading-snug">
                      {isRTL ? item.label.ar : item.label.en}
                    </p>
                  </div>
                  <div className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <InstagramGlyph className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <div className="text-center">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-brand/40 text-accent hover:bg-brand/10 font-semibold px-8 py-3 rounded-full transition-all"
          >
            <InstagramGlyph className="w-4 h-4" />
            {isRTL ? "تابعونا على انستغرام" : "Follow on Instagram"}
          </a>
        </div>
      </div>
    </section>
  );
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}
