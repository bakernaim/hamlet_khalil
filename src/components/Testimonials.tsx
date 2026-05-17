"use client";

import { useLang } from "@/context/LanguageContext";
import { testimonials } from "@/data/content";

export default function Testimonials() {
  const { isRTL } = useLang();

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative py-24 lg:py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#06091e] to-[#080c22]" />
      <div className="absolute inset-0 pattern-overlay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-60 rounded-full bg-[#00b86a]/4 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#00b86a]/80 text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            {isRTL ? "آراء الحجاج والزوار" : "Pilgrim Reviews"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-bold mb-4">
            {isRTL ? "ماذا قالوا عنّا" : "What They Say About Us"}
          </h2>
          <div className="flex justify-center mt-6">
            <svg width="120" height="16" viewBox="0 0 120 16">
              <line x1="0" y1="8" x2="45" y2="8" stroke="url(#qlg1)" strokeWidth="1"/>
              <circle cx="56" cy="8" r="4" fill="none" stroke="#00b86a" strokeWidth="1.5" opacity="0.7"/>
              <circle cx="60" cy="8" r="2" fill="#00b86a" opacity="0.8"/>
              <circle cx="64" cy="8" r="4" fill="none" stroke="#00b86a" strokeWidth="1.5" opacity="0.7"/>
              <line x1="75" y1="8" x2="120" y2="8" stroke="url(#qlg2)" strokeWidth="1"/>
              <defs>
                <linearGradient id="qlg1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00b86a" stopOpacity="0"/>
                  <stop offset="100%" stopColor="#00b86a" stopOpacity="0.6"/>
                </linearGradient>
                <linearGradient id="qlg2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00b86a" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#00b86a" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative rounded-2xl p-6 border border-white/6 hover:border-[#00b86a]/30 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-[#00b86a]/8"
              style={{ background: 'linear-gradient(150deg, #0f1428 0%, #07091d 100%)' }}
            >
              {/* Top gold bar */}
              <div className="absolute top-0 start-6 end-6 h-px bg-gradient-to-r from-transparent via-[#00b86a]/40 to-transparent" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4 text-amber-400 text-sm">
                {[...Array(t.stars)].map((_, si) => <span key={si}>★</span>)}
              </div>

              {/* Large quote glyph */}
              <div
                className="text-[72px] leading-none font-serif text-[#00b86a]/12 select-none mb-1 h-10 flex items-start"
                aria-hidden
              >
                {isRTL ? "«" : '"'}
              </div>

              <p className="text-white/72 text-sm leading-7 mb-6">
                {isRTL ? t.quote.ar : t.quote.en}
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 border-t border-white/8 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00b86a]/30 to-[#00b86a]/10 border border-[#00b86a]/25 flex items-center justify-center text-[#00b86a] font-bold text-sm shrink-0">
                  {(isRTL ? t.name.ar : t.name.en).charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {isRTL ? t.name.ar : t.name.en}
                  </div>
                  <div className="text-[#00b86a]/60 text-xs mt-0.5 flex items-center gap-1">
                    <span className="text-[8px]">✦</span>
                    {isRTL ? t.destination.ar : t.destination.en}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
