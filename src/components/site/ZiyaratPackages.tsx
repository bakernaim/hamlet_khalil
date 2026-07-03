"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { waHref } from "@/lib/whatsapp";
import type { ZiyaratPackageDTO } from "@/lib/types";
import Reveal from "@/components/site/Reveal";

export default function ZiyaratPackages({
  packages,
  whatsappNumber,
}: {
  packages: ZiyaratPackageDTO[];
  whatsappNumber: string;
}) {
  const { isRTL } = useLang();

  const bookMsg = (name: string) =>
    isRTL
      ? `السلام عليكم، أريد الاستفسار عن باقة: ${name}`
      : `Hello, I'd like to inquire about: ${name}`;

  return (
    <section id="ziyarat" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-page pattern-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "باقاتنا المقدسة" : "Sacred Packages"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3">
            {isRTL ? "زيارات الأماكن المقدسة" : "Ziyarat Packages"}
          </h2>
          <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
            {isRTL
              ? "رحلات روحانية منظمة مع مرشد ديني متخصص"
              : "Fully organized spiritual journeys with a specialist religious guide"}
          </p>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        {packages.length === 0 ? (
          <p className="text-center text-muted text-sm">
            {isRTL ? "لا توجد باقات متاحة حالياً" : "No packages available right now"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {packages.map((pkg, i) => {
              const name = isRTL ? pkg.nameAr : pkg.nameEn;
              const duration = isRTL ? pkg.durationAr : pkg.durationEn;
              const badge = isRTL ? pkg.badgeAr : pkg.badgeEn;
              const highlights = isRTL ? pkg.highlightsAr : pkg.highlightsEn;
              const isArbaeen = pkg.slug === "arbaeen" || Boolean(badge);

              return (
                <Reveal key={pkg.id} delay={i * 80}>
                  <article
                    id={`ziyarat-${pkg.slug}`}
                    className={`package-card group flex flex-col rounded-2xl overflow-hidden border ${
                      isArbaeen ? "border-brand/40 glow-ring" : "border-line"
                    } bg-card h-full`}
                  >
                    {/* Photo */}
                    <div className="relative h-44 sm:h-48 shrink-0 overflow-hidden">
                      <Image
                        src={pkg.image}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/30 dark:from-card via-transparent to-transparent" />

                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        <span className="text-xl drop-shadow">{pkg.flag}</span>
                        <span className="bg-black/65 backdrop-blur-sm text-white/85 text-[10px] font-medium px-2.5 py-1 rounded-full">
                          {duration}
                        </span>
                      </div>

                      {badge && (
                        <div className="absolute bottom-3 start-3 bg-brand text-[#040d18] text-[10px] font-bold px-2.5 py-1 rounded-full shimmer-badge">
                          {badge}
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-ink font-bold text-sm leading-snug flex-1">{name}</h3>
                        <div className="text-end shrink-0">
                          <div className="text-accent text-lg font-bold leading-none">${pkg.price}</div>
                          <div className="text-muted/80 text-[10px] mt-0.5">{isRTL ? "/شخص" : "/person"}</div>
                        </div>
                      </div>

                      <div className="h-px bg-line mb-3" />

                      <ul className="space-y-2 mb-4 flex-1">
                        {highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-soft text-xs leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1" />
                            {h}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(isRTL
                          ? ["✈️ رحلة", "🏨 إقامة", "🚌 نقل", "👳 مرشد"]
                          : ["✈️ Flight", "🏨 Hotel", "🚌 Bus", "👳 Guide"]
                        ).map((s) => (
                          <span key={s} className="text-[10px] text-muted bg-ink/4 border border-ink/8 px-2 py-0.5 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>

                      <a
                        href={waHref(whatsappNumber, bookMsg(name))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full text-center text-sm font-semibold py-3 rounded-xl transition-colors duration-200 min-h-[44px] flex items-center justify-center ${
                          isArbaeen
                            ? "bg-brand text-[#040d18] hover:bg-brand-hover"
                            : "bg-brand/10 border border-brand/30 text-accent hover:bg-brand hover:text-[#040d18] hover:border-brand"
                        }`}
                      >
                        {isRTL ? "احجز الآن" : "Book Now"}
                      </a>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
