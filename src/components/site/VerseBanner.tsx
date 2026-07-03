"use client";

import { useLang } from "@/context/LanguageContext";
import { verse } from "@/data/content";
import Reveal from "@/components/site/Reveal";

// Quranic travel dua rendered in Amiri calligraphy inside a mihrab-arch frame.
export default function VerseBanner() {
  const { isRTL } = useLang();

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative py-14 sm:py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-page pattern-overlay" />

      {/* Soft green glow behind the arch */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-2/3 h-56 rounded-full bg-[#00b86a]/12 blur-[90px]" />
      </div>

      <Reveal className="relative z-10 max-w-2xl mx-auto">
        <div className="arch-frame bg-card/60 backdrop-blur-sm px-6 sm:px-12 pt-12 sm:pt-14 pb-8 sm:pb-10 text-center">
          {/* Star ornament */}
          <div className="flex justify-center mb-5">
            <span className="text-accent/80 text-xl spin-slow inline-block">✦</span>
          </div>

          {/* The verse — always Arabic, Amiri */}
          <p dir="rtl" className="font-quran text-ink/90 text-xl sm:text-2xl lg:text-[1.7rem] mb-5">
            ﴿ {verse.arabic} ﴾
          </p>

          {/* Translation / label */}
          {!isRTL && (
            <p className="text-muted text-sm italic leading-relaxed max-w-lg mx-auto mb-3">
              {verse.translation.en}
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-accent/50" />
            <span className="text-accent text-xs tracking-wide">
              {isRTL ? verse.reference.ar : verse.reference.en}
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-accent/50" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
