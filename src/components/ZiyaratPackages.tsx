"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { ziyaratPackages, WHATSAPP_URL } from "@/data/content";

const SHRINE_IMAGES: Record<string, string> = {
  iraq:    "/shrines/hussain-karbala.jpg",
  iran:    "/shrines/reza-mashhad.jpg",
  arbaeen: "/shrines/arbaeen-crowd.jpg",
  syria:   "/shrines/zaynab-damascus.jpg",
};

const SHRINE_ALT: Record<string, { ar: string; en: string }> = {
  iraq:    { ar: "ضريح الإمام الحسين، كربلاء", en: "Imam Hussain Shrine, Karbala" },
  iran:    { ar: "ضريح الإمام الرضا، مشهد",    en: "Imam Reza Shrine, Mashhad" },
  arbaeen: { ar: "مسيرة الأربعين، كربلاء",      en: "Arbaeen March, Karbala" },
  syria:   { ar: "ضريح السيدة زينب، دمشق",     en: "Sayyida Zaynab Shrine, Damascus" },
};

const SERVICES_AR = ["✈️ رحلة جوية", "🏨 إقامة فندقية", "🚌 نقل داخلي", "👳 مرشد ديني"];
const SERVICES_EN = ["✈️ Flights", "🏨 Hotel", "🚌 Transport", "👳 Guide"];

export default function ZiyaratPackages() {
  const { isRTL } = useLang();

  const bookMsg = (name: string) =>
    encodeURIComponent(isRTL
      ? `السلام عليكم، أريد الاستفسار عن باقة: ${name}`
      : `Hello, I'd like to inquire about: ${name}`
    );

  return (
    <section id="ziyarat" dir={isRTL ? "rtl" : "ltr"} className="relative py-24 px-4">
      <div className="absolute inset-0 bg-[#040d18]" />
      <div className="absolute inset-0 pattern-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── Heading ── */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#00b86a] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            {isRTL ? "باقاتنا المقدسة" : "Sacred Packages"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {isRTL ? "زيارات الأماكن المقدسة" : "Ziyarat Packages"}
          </h2>
          <p className="text-white/45 max-w-lg mx-auto text-sm leading-relaxed">
            {isRTL
              ? "رحلات روحانية منظمة مع مرشد ديني متخصص وخدمات متكاملة"
              : "Fully organized spiritual journeys with a specialist religious guide"}
          </p>
          <div className="section-divider w-20 mx-auto mt-6" />
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ziyaratPackages.map((pkg) => {
            const name      = isRTL ? pkg.name.ar : pkg.name.en;
            const alt       = isRTL ? SHRINE_ALT[pkg.id].ar : SHRINE_ALT[pkg.id].en;
            const isArbaeen = pkg.id === "arbaeen";

            return (
              <article
                key={pkg.id}
                className={`package-card flex flex-col rounded-2xl overflow-hidden border ${
                  isArbaeen ? "border-[#00b86a]/40" : "border-[#162035]"
                } bg-[#0b1828]`}
              >
                {/* Photo */}
                <div className="relative h-44 shrink-0 overflow-hidden">
                  <Image
                    src={SHRINE_IMAGES[pkg.id]}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1828] via-transparent to-transparent" />

                  {/* Flag + duration row over image */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="text-xl" style={{ filter:'drop-shadow(0 2px 4px rgba(0,0,0,.7))' }}>
                      {pkg.flag}
                    </span>
                    <span className="bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {isRTL ? pkg.duration.ar : pkg.duration.en}
                    </span>
                  </div>

                  {/* Hot badge */}
                  {pkg.badge && (
                    <div className="absolute bottom-3 start-3 bg-[#00b86a] text-[#040d18] text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {isRTL ? pkg.badge.ar : pkg.badge.en}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5">

                  {/* Title + price row */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <h3 className="text-white font-bold text-sm leading-snug flex-1">{name}</h3>
                    <div className="text-end shrink-0">
                      <div className="text-[#00b86a] text-xl font-bold leading-none">${pkg.price}</div>
                      <div className="text-white/35 text-[10px] mt-0.5">{isRTL ? "/ شخص" : "/ person"}</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#162035] mb-4" />

                  {/* Highlights */}
                  <ul className="space-y-2 mb-5 flex-1">
                    {(isRTL ? pkg.highlights.ar : pkg.highlights.en).map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-white/65 text-xs leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00b86a] shrink-0 mt-1" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(isRTL ? SERVICES_AR : SERVICES_EN).map((s) => (
                      <span key={s} className="text-[10px] text-white/50 bg-white/5 border border-white/8 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={`${WHATSAPP_URL}?text=${bookMsg(name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center text-sm font-bold py-3 rounded-xl transition-all duration-200 ${
                      isArbaeen
                        ? "bg-[#00b86a] text-[#040d18] hover:bg-[#33d68a] hover:shadow-lg hover:shadow-[#00b86a]/20"
                        : "bg-[#00b86a]/10 border border-[#00b86a]/35 text-[#00b86a] hover:bg-[#00b86a] hover:text-[#040d18]"
                    }`}
                  >
                    {isRTL ? "احجز الآن" : "Book Now"}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
