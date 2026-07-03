"use client";

import { useLang } from "@/context/LanguageContext";
import { testimonials } from "@/data/content";

export default function Testimonials() {
  const { isRTL } = useLang();

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-page-alt pattern-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "آراء الحجاج" : "Reviews"}
          </span>
          {/* h2 → Reem Kufi */}
          <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3">
            {isRTL ? "ماذا قالوا عنّا" : "What They Say"}
          </h2>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl p-5 sm:p-6 border border-line hover:border-[#00b86a]/35 transition-colors bg-card"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3 text-amber-500 dark:text-amber-400 text-sm">
                {[...Array(t.stars)].map((_, si) => <span key={si}>★</span>)}
              </div>

              {/* Quote — Cairo body font */}
              <p className="text-soft text-sm leading-7 flex-1 mb-5">
                {isRTL ? t.quote.ar : t.quote.en}
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 border-t border-line pt-4">
                <div className="w-9 h-9 rounded-full bg-[#00b86a]/12 border border-[#00b86a]/25 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                  {(isRTL ? t.name.ar : t.name.en).charAt(0)}
                </div>
                <div>
                  {/* Name — Cairo (small UI text) */}
                  <div className="text-ink font-semibold text-sm">
                    {isRTL ? t.name.ar : t.name.en}
                  </div>
                  <div className="text-accent/80 text-xs mt-0.5">
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
