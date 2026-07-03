"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import type { SiteSettings } from "@/lib/types";
import CountUp from "@/components/site/CountUp";

export default function Hero({ settings }: { settings: SiteSettings }) {
  const { isRTL } = useLang();

  const heading = isRTL ? settings.heroHeadingAr : settings.heroHeadingEn;
  const subheading = isRTL ? settings.heroSubheadingAr : settings.heroSubheadingEn;

  const stats = [
    { value: 5000, suffix: "+", label: { ar: "حاج وزائر", en: "Pilgrims" } },
    { value: 15, suffix: "+", label: { ar: "سنة خبرة", en: "Years" } },
    { value: 20, suffix: "+", label: { ar: "وجهة سفر", en: "Destinations" } },
  ];

  return (
    <section
      id="home"
      dir={isRTL ? "rtl" : "ltr"}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/shrines/hussain-karbala.jpg"
          alt="Imam Hussain Shrine, Karbala"
          fill
          priority
          className="object-cover object-center hero-kenburns"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />
      </div>

      {/* Animated aurora glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-[#00b86a]/6 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-page to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full text-center max-w-3xl mx-auto px-5 sm:px-8 pt-24 sm:pt-28 pb-36 sm:pb-44">

        {/* Badge */}
        <div className="hero-fade inline-flex items-center gap-2 bg-black/50 border border-[#00b86a]/30 rounded-full px-4 py-1.5 mb-6 sm:mb-8 backdrop-blur-sm" style={{ animationDelay: "0.05s" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00b86a] shrink-0 animate-pulse" />
          <span className="text-white/75 text-[11px] sm:text-xs font-medium tracking-widest uppercase">
            {isRTL ? "وكالة سياحة لبنانية معتمدة" : "Licensed Lebanese Travel Agency"}
          </span>
        </div>

        {/* Heading — Reem Kufi via h1 */}
        <h1 className="hero-fade text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 drop-shadow-xl" style={{ animationDelay: "0.15s" }}>
          {heading}
        </h1>

        {/* Divider */}
        <div className="hero-fade flex items-center justify-center gap-3 mb-5" style={{ animationDelay: "0.25s" }}>
          <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#00b86a]/60" />
          <span className="text-[#00b86a]">✦</span>
          <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#00b86a]/60" />
        </div>

        {/* Subheading — Cairo body font */}
        <p className="hero-fade text-white/60 text-sm sm:text-base max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed" style={{ animationDelay: "0.35s" }}>
          {subheading}
        </p>

        {/* CTAs */}
        <div className={`hero-fade flex flex-col sm:flex-row gap-3 justify-center ${isRTL ? "sm:flex-row-reverse" : ""}`} style={{ animationDelay: "0.45s" }}>
          <a
            href="#ziyarat"
            className="inline-flex items-center justify-center gap-2 bg-[#00b86a] hover:bg-[#33d68a] text-[#040d18] font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-colors duration-200 shadow-lg shadow-[#00b86a]/20"
          >
            🕌 {isRTL ? "باقات الزيارة" : "Ziyarat Packages"}
          </a>
          <a
            href="#trips"
            className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-colors duration-200 hover:bg-white/8"
          >
            🧭 {isRTL ? "الرحلات الحالية" : "Current Trips"}
          </a>
        </div>

        {/* Stats */}
        <div className="hero-fade mt-12 sm:mt-16 grid grid-cols-3 gap-4 max-w-xs sm:max-w-sm mx-auto" style={{ animationDelay: "0.55s" }}>
          {stats.map((s) => (
            <div key={s.label.en} className="flex flex-col items-center gap-0.5">
              <div className="text-3xl sm:text-4xl font-bold text-[#00b86a]">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-white/55 text-xs sm:text-sm text-center">
                {isRTL ? s.label.ar : s.label.en}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bounce-soft opacity-50">
        <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}
