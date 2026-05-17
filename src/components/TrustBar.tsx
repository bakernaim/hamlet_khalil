"use client";

import { useLang } from "@/context/LanguageContext";
import { trustItems } from "@/data/content";

export default function TrustBar() {
  const { isRTL } = useLang();

  return (
    <section
      id="about"
      dir={isRTL ? "rtl" : "ltr"}
      className="relative py-16 px-4 overflow-hidden"
    >
      {/* Deep background with subtle crimson */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06091e] via-[#0c1028] to-[#06091e]" />
      <div className="absolute inset-0 pattern-overlay opacity-60" />

      {/* Centre glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[60%] h-40 rounded-full bg-[#00b86a]/5 blur-[60px]" />
      </div>

      {/* Gold top/bottom dividers */}
      <div className="absolute top-0 left-0 right-0 gold-divider" />
      <div className="absolute bottom-0 left-0 right-0 gold-divider" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Ornamental heading */}
        <div className="text-center mb-10">
          <div className="ornate-divider max-w-xs mx-auto">
            <span className="text-[#00b86a]/70 text-xs font-semibold tracking-widest uppercase whitespace-nowrap px-2">
              {isRTL ? "لماذا تختارنا" : "Why Choose Us"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustItems.map((item, i) => (
            <div key={i} className="group flex flex-col items-center text-center">
              {/* Icon container with Islamic arch shape */}
              <div className="relative mb-4">
                {/* Outer ring */}
                <div className="w-20 h-20 rounded-full border border-[#00b86a]/20 absolute inset-0 -m-2 group-hover:border-[#00b86a]/50 transition-all group-hover:scale-110" />
                {/* Main icon box */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00b86a]/15 to-[#00b86a]/5 border border-[#00b86a]/25 flex items-center justify-center text-3xl transition-all group-hover:bg-[#00b86a]/25 group-hover:shadow-lg group-hover:shadow-[#00b86a]/15">
                  {item.icon}
                </div>
                {/* Corner stars */}
                <span className="absolute -top-1 -end-1 text-[#00b86a]/50 text-xs opacity-0 group-hover:opacity-100 transition-opacity">✦</span>
              </div>

              <h3 className="text-white font-bold text-sm lg:text-base mb-2">
                {isRTL ? item.title.ar : item.title.en}
              </h3>
              <p className="text-white/45 text-xs lg:text-sm leading-relaxed max-w-[160px]">
                {isRTL ? item.desc.ar : item.desc.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
