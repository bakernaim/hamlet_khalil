"use client";

import { useLang } from "@/context/LanguageContext";
import { howItWorks } from "@/data/content";
import Reveal from "@/components/site/Reveal";

// 4-step "book in minutes" journey with a connecting line on desktop.
export default function HowItWorks() {
  const { isRTL } = useLang();

  return (
    <section id="how" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-page pattern-overlay" />
      <div className="absolute top-0 left-0 right-0 gold-divider" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "خطوات بسيطة" : "Simple Steps"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3">
            {isRTL ? "كيف تحجز رحلتك؟" : "How It Works"}
          </h2>
          <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
            {isRTL
              ? "من اختيار الباقة حتى الوصول — أربع خطوات فقط"
              : "From choosing a package to arrival — just four steps"}
          </p>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-8 inset-x-16 h-px bg-gradient-to-r from-brand/10 via-brand/40 to-brand/10" />

          {howItWorks.map((step, i) => (
            <Reveal key={step.icon} delay={i * 120}>
              <div className="relative flex flex-col items-center text-center">
                {/* Numbered icon disc */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-brand/30 flex items-center justify-center text-3xl shadow-lg shadow-black/8 dark:shadow-black/30">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -end-2 w-6 h-6 rounded-full bg-brand text-[#040d18] text-xs font-bold flex items-center justify-center">
                    {isRTL ? ["١", "٢", "٣", "٤"][i] : i + 1}
                  </span>
                </div>
                <h3 className="text-ink font-bold text-base mb-2">
                  {isRTL ? step.title.ar : step.title.en}
                </h3>
                <p className="text-muted text-xs leading-relaxed max-w-[210px]">
                  {isRTL ? step.desc.ar : step.desc.en}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
