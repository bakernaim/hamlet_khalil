"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { faq } from "@/data/content";
import Reveal from "@/components/site/Reveal";

export default function FAQ() {
  const { isRTL } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-page pattern-overlay" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "أسئلة شائعة" : "FAQ"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3">
            {isRTL ? "كل ما تريد معرفته" : "Everything You Need to Know"}
          </h2>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        <div className="space-y-3">
          {faq.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={i} delay={i * 60}>
                <div
                  className={`rounded-2xl border bg-card overflow-hidden transition-colors duration-300 ${
                    open ? "border-brand/40" : "border-line hover:border-brand/25"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-start"
                  >
                    <span className={`font-semibold text-sm sm:text-base transition-colors ${open ? "text-accent" : "text-ink"}`}>
                      {isRTL ? item.q.ar : item.q.en}
                    </span>
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        open
                          ? "border-brand/50 bg-brand/10 text-accent rotate-180"
                          : "border-ink/15 text-muted"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div className={`faq-body ${open ? "faq-body-open" : ""}`}>
                    <div>
                      <p className="px-5 sm:px-6 pb-5 text-soft text-sm leading-relaxed">
                        {isRTL ? item.a.ar : item.a.en}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
