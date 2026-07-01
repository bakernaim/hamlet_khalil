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

export default function ZiyaratPackages() {
  const { isRTL } = useLang();

  const bookMsg = (name: string) =>
    encodeURIComponent(isRTL
      ? `السلام عليكم، أريد الاستفسار عن باقة: ${name}`
      : `Hello, I'd like to inquire about: ${name}`
    );

  return (
    <section id="ziyarat" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-[#040d18] pattern-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[#00b86a] text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "باقاتنا المقدسة" : "Sacred Packages"}
          </span>
          {/* h2 → Reem Kufi */}
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
            {isRTL ? "زيارات الأماكن المقدسة" : "Ziyarat Packages"}
          </h2>
          <p className="text-white/45 max-w-md mx-auto text-sm leading-relaxed">
            {isRTL
              ? "رحلات روحانية منظمة مع مرشد ديني متخصص"
              : "Fully organized spiritual journeys with a specialist religious guide"}
          </p>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        {/* Grid — 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {ziyaratPackages.map((pkg) => {
            const name      = isRTL ? pkg.name.ar : pkg.name.en;
            const isArbaeen = pkg.id === "arbaeen";

            return (
              <article
                key={pkg.id}
                className={`package-card flex flex-col rounded-2xl overflow-hidden border ${
                  isArbaeen ? "border-[#00b86a]/40" : "border-[#162035]"
                } bg-[#0b1828]`}
              >
                {/* Photo */}
                <div className="relative h-44 sm:h-48 shrink-0 overflow-hidden">
                  <Image
                    src={SHRINE_IMAGES[pkg.id]}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1828] via-transparent to-transparent" />

                  {/* Flag + duration */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="text-xl drop-shadow">{pkg.flag}</span>
                    <span className="bg-black/65 backdrop-blur-sm text-white/85 text-[10px] font-medium px-2.5 py-1 rounded-full">
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
                <div className="flex flex-col flex-1 p-4 sm:p-5">

                  {/* Title + price — h3 uses Reem Kufi */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-white font-bold text-sm leading-snug flex-1">{name}</h3>
                    <div className="text-end shrink-0">
                      <div className="text-[#00b86a] text-lg font-bold leading-none">${pkg.price}</div>
                      <div className="text-white/35 text-[10px] mt-0.5">{isRTL ? "/شخص" : "/person"}</div>
                    </div>
                  </div>

                  <div className="h-px bg-[#162035] mb-3" />

                  {/* Highlights — Cairo body font */}
                  <ul className="space-y-2 mb-4 flex-1">
                    {(isRTL ? pkg.highlights.ar : pkg.highlights.en).map((h) => (
                      <li key={h} className="flex items-start gap-2 text-white/60 text-xs leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00b86a] shrink-0 mt-1" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(isRTL
                      ? ["✈️ رحلة", "🏨 إقامة", "🚌 نقل", "👳 مرشد"]
                      : ["✈️ Flight", "🏨 Hotel", "🚌 Bus", "👳 Guide"]
                    ).map((s) => (
                      <span key={s} className="text-[10px] text-white/45 bg-white/5 border border-white/8 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* CTA — Cairo font for button text */}
                  <a
                    href={`${WHATSAPP_URL}?text=${bookMsg(name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center text-sm font-semibold py-3 rounded-xl transition-colors duration-200 min-h-[44px] flex items-center justify-center ${
                      isArbaeen
                        ? "bg-[#00b86a] text-[#040d18] hover:bg-[#33d68a]"
                        : "bg-[#00b86a]/10 border border-[#00b86a]/30 text-[#00b86a] hover:bg-[#00b86a] hover:text-[#040d18] hover:border-[#00b86a]"
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
