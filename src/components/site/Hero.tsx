"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { hero } from "@/data/content";

export default function Hero() {
  const { isRTL } = useLang();

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
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040d18]/60 via-[#040d18]/50 to-[#040d18]" />
      </div>

      {/* Soft glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-[#00b86a]/6 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#040d18] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full text-center max-w-3xl mx-auto px-5 sm:px-8 pt-24 sm:pt-28 pb-36 sm:pb-44">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-black/50 border border-[#00b86a]/30 rounded-full px-4 py-1.5 mb-6 sm:mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00b86a] shrink-0" />
          <span className="text-white/75 text-[11px] sm:text-xs font-medium tracking-widest uppercase">
            {isRTL ? "وكالة سياحة لبنانية معتمدة" : "Licensed Lebanese Travel Agency"}
          </span>
        </div>

        {/* Heading — Reem Kufi via h1 */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 drop-shadow-xl">
          {isRTL ? hero.heading.ar : hero.heading.en}
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#00b86a]/60" />
          <span className="text-[#00b86a]">✦</span>
          <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#00b86a]/60" />
        </div>

        {/* Subheading — Cairo body font */}
        <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          {isRTL ? hero.subheading.ar : hero.subheading.en}
        </p>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row gap-3 justify-center ${isRTL ? "sm:flex-row-reverse" : ""}`}>
          <a
            href="#ziyarat"
            className="inline-flex items-center justify-center gap-2 bg-[#00b86a] hover:bg-[#33d68a] text-[#040d18] font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-colors duration-200 shadow-lg shadow-[#00b86a]/20"
          >
            🕌 {isRTL ? hero.cta1.ar : hero.cta1.en}
          </a>
          <a
            href="#tourism"
            className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-colors duration-200 hover:bg-white/8"
          >
            ✈️ {isRTL ? hero.cta2.ar : hero.cta2.en}
          </a>
        </div>

        {/* Stats */}
        <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 max-w-xs sm:max-w-sm mx-auto">
          {[
            { num: "+5,000", label: { ar: "حاج وزائر",   en: "Pilgrims" } },
            { num: "15+",    label: { ar: "سنة خبرة",    en: "Years" } },
            { num: "4",      label: { ar: "وجهات مقدسة", en: "Destinations" } },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-0.5">
              <div className="text-3xl sm:text-4xl font-bold text-[#00b86a]">{s.num}</div>
              <div className="text-white/55 text-xs sm:text-sm text-center">
                {isRTL ? s.label.ar : s.label.en}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bounce-soft opacity-40">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}
