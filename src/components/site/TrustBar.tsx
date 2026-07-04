"use client";

import { useLang } from "@/context/LanguageContext";
import { trustItems } from "@/data/content";

export default function TrustBar() {
  const { isRTL } = useLang();

  return (
    <section id="about" dir={isRTL ? "rtl" : "ltr"} className="relative py-12 sm:py-16 px-4">
      <div className="absolute inset-0 bg-page-alt" />
      <div className="absolute top-0 left-0 right-0 gold-divider" />
      <div className="absolute bottom-0 left-0 right-0 gold-divider" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <div className="ornate-divider max-w-[220px] mx-auto">
            <span className="text-accent/90 text-xs font-medium tracking-widest uppercase whitespace-nowrap px-3">
              {isRTL ? "لماذا تختارنا" : "Why Choose Us"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {trustItems.map((item, i) => (
            <div key={i} className="group flex flex-col items-center text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-2xl sm:text-3xl mb-3 transition-colors group-hover:bg-brand/18 group-hover:border-brand/40">
                {item.icon}
              </div>
              <h3 className="text-ink font-bold text-sm sm:text-base mb-1.5">
                {isRTL ? item.title.ar : item.title.en}
              </h3>
              <p className="text-muted text-xs leading-relaxed max-w-[150px]">
                {isRTL ? item.desc.ar : item.desc.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
