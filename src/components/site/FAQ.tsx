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
      <div className="absolute inset-0 bg-[#eef4f0] pattern-overlay" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[#00995a] text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "أسئلة شائعة" : "FAQ"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0c1a14] mb-3">
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
                  className={`rounded-2xl border bg-white overflow-hidden transition-colors duration-300 ${
                    open ? "border-[#00b86a]/40" : "border-[#d9e3dd] hover:border-[#00b86a]/25"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-start"
                  >
                    <span className={`font-semibold text-sm sm:text-base transition-colors ${open ? "text-[#00995a]" : "text-[#0c1a14]"}`}>
                      {isRTL ? item.q.ar : item.q.en}
                    </span>
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        open
                          ? "border-[#00b86a]/50 bg-[#00b86a]/10 text-[#00995a] rotate-180"
                          : "border-[#0c1a14]/15 text-[#5b6b63]"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div className={`faq-body ${open ? "faq-body-open" : ""}`}>
                    <div>
                      <p className="px-5 sm:px-6 pb-5 text-[#3d4b44] text-sm leading-relaxed">
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
