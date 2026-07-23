"use client";

import { useState } from "react";
import ImageCarousel from "@/components/site/ImageCarousel";
import { useLang } from "@/context/LanguageContext";
import type { SectionCopy, TourismPackageDTO } from "@/lib/types";
import Reveal from "@/components/site/Reveal";
import PackageInfoModal from "@/components/site/PackageInfoModal";

export default function TourismPackages({
  packages,
  copy,
}: {
  packages: TourismPackageDTO[];
  copy: SectionCopy;
}) {
  const { isRTL } = useLang();
  const [infoPkg, setInfoPkg] = useState<TourismPackageDTO | null>(null);
  const pkgInfo = (pkg: TourismPackageDTO) =>
    isRTL ? pkg.infoAr || pkg.infoEn : pkg.infoEn || pkg.infoAr;

  return (
    <section id="tourism" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-page-alt pattern-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "استكشف العالم" : "Explore the World"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3">
            {isRTL ? copy.titleAr : copy.titleEn}
          </h2>
          <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
            {isRTL ? copy.descAr : copy.descEn}
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
              const desc = isRTL ? pkg.descAr : pkg.descEn;
              const gallery = [pkg.image, ...pkg.images].filter(Boolean);

              return (
                <Reveal key={pkg.id} delay={i * 80}>
                  <article
                    id={`tourism-${pkg.slug}`}
                    className="package-card group flex flex-col rounded-2xl overflow-hidden border border-line bg-card h-full"
                  >
                    {/* Photo */}
                    <div className="relative h-44 sm:h-48 shrink-0 overflow-hidden">
                      <ImageCarousel
                        images={gallery}
                        alt={name}
                        className="absolute inset-0"
                        imageClassName="transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/30 dark:from-card via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        <span className="text-xl drop-shadow">{pkg.flag}</span>
                        <span className="bg-black/65 backdrop-blur-sm text-white/85 text-[10px] font-medium px-2.5 py-1 rounded-full">
                          {duration}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-4 sm:p-5">
                      <h3 className="text-ink font-bold text-base leading-snug mb-3">{name}</h3>

                      <div className="h-px bg-line mb-3" />

                      <p className="text-soft text-xs leading-relaxed mb-4 flex-1">{desc}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(isRTL
                          ? ["✈️ رحلة", "🏨 فندق", "🚌 نقل"]
                          : ["✈️ Flights", "🏨 Hotel", "🚌 Transfer"]
                        ).map((s) => (
                          <span key={s} className="text-[10px] text-muted bg-ink/4 border border-ink/8 px-2 py-0.5 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>

                      {pkgInfo(pkg) && (
                        <button
                          onClick={() => setInfoPkg(pkg)}
                          className="w-full text-center text-sm font-semibold py-2.5 rounded-xl bg-brand/10 border border-brand/30 text-accent hover:bg-brand-hover transition-colors duration-200 min-h-[42px] flex items-center justify-center"
                        >
                          {isRTL ? "التفاصيل الكاملة 📖" : "Full Details 📖"}
                        </button>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>

      {infoPkg && (
        <PackageInfoModal
          open
          onClose={() => setInfoPkg(null)}
          title={isRTL ? infoPkg.nameAr : infoPkg.nameEn}
          flag={infoPkg.flag}
          duration={isRTL ? infoPkg.durationAr : infoPkg.durationEn}
          image={infoPkg.image}
          html={pkgInfo(infoPkg)}
        />
      )}
    </section>
  );
}
