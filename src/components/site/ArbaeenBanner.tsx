"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { waHref } from "@/lib/whatsapp";

const ARBAEEN_DATE = new Date("2025-08-13T00:00:00Z");

function getCountdown() {
  const diff = ARBAEEN_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
    past: false,
  };
}

function DigitBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-black/50 border border-amber-600/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 min-w-[52px] sm:min-w-[64px] text-center backdrop-blur-sm">
        <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-amber-400/60 text-[10px] sm:text-xs">{label}</span>
    </div>
  );
}

export default function ArbaeenBanner({ whatsappNumber }: { whatsappNumber: string }) {
  const { isRTL } = useLang();
  const WHATSAPP_URL = waHref(whatsappNumber);
  const [cd, setCd] = useState(getCountdown());

  useEffect(() => {
    const id = setInterval(() => setCd(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  const msg = encodeURIComponent(
    isRTL
      ? "السلام عليكم، أريد التسجيل في موكب الأربعين ٢٠٢٥"
      : "Hello, I'd like to register for Arbaeen 2025"
  );

  const L = isRTL
    ? { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" }
    : { days: "Days", hours: "Hours", minutes: "Mins", seconds: "Secs" };

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4 overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="/shrines/arbaeen-crowd.jpg"
          alt="Arbaeen Pilgrimage"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0f0300]/88" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040d18]/70 to-transparent" />
      </div>

      {/* Soft amber glow — static, no animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-3/4 h-64 rounded-full bg-amber-700/12 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">

        {/* Icons */}
        <div className="flex justify-center gap-3 mb-5 text-2xl sm:text-3xl">
          <span>🏴</span><span>🕌</span><span>🏴</span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-600/35 rounded-full px-4 py-1.5 mb-5 backdrop-blur-sm">
          <span className="text-amber-300/80 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
            {isRTL ? "أعظم موكب في التاريخ" : "The Greatest March in History"}
          </span>
        </div>

        {/* h2 — Reem Kufi */}
        <h2 className="text-2xl sm:text-4xl font-bold text-amber-300 mb-3">
          {isRTL ? "موكب الأربعين ٢٠٢٥" : "Arbaeen 2025 Convoy"}
        </h2>

        {/* Body — Cairo */}
        <p className="text-amber-200/60 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
          {isRTL
            ? "انضم إلى الملايين في أكبر تجمع بشري على وجه الأرض"
            : "Join millions in the largest human gathering on Earth — Holy Karbala"}
        </p>

        {/* Countdown */}
        {!cd.past && (
          <div className="mb-8">
            <p className="text-amber-500/55 text-[10px] sm:text-xs mb-4 uppercase tracking-widest">
              {isRTL ? "الوقت المتبقي" : "Countdown"}
            </p>
            <div className="flex gap-2 sm:gap-4 justify-center items-start">
              <DigitBox value={cd.days}    label={L.days} />
              <span className="text-amber-600/50 text-xl sm:text-2xl font-bold mt-2">:</span>
              <DigitBox value={cd.hours}   label={L.hours} />
              <span className="text-amber-600/50 text-xl sm:text-2xl font-bold mt-2">:</span>
              <DigitBox value={cd.minutes} label={L.minutes} />
              <span className="text-amber-600/50 text-xl sm:text-2xl font-bold mt-2">:</span>
              <DigitBox value={cd.seconds} label={L.seconds} />
            </div>
          </div>
        )}

        {/* Price */}
        <div className="inline-flex items-center gap-3 sm:gap-4 bg-black/40 border border-amber-600/25 rounded-2xl px-5 sm:px-7 py-3 sm:py-4 mb-7 backdrop-blur-sm">
          <div>
            <div className="text-white/45 text-xs">{isRTL ? "يبدأ من" : "From"}</div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-300">$1,100</div>
          </div>
          <div className="w-px h-8 bg-amber-600/25" />
          <div className="text-white/55 text-xs space-y-1 text-start">
            <div>{isRTL ? "١٤ يوماً" : "14 Days"}</div>
            <div>{isRTL ? "شامل كل شيء" : "All Inclusive"}</div>
          </div>
        </div>

        {/* CTA — Cairo for button text */}
        <div>
          <a
            href={`${WHATSAPP_URL}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm sm:text-base px-7 sm:px-9 py-3.5 rounded-full transition-colors duration-200 min-h-[48px] whatsapp-pulse"
          >
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {isRTL ? "سجّل مكانك الآن" : "Reserve Your Spot Now"}
          </a>
          <p className="text-white/25 text-xs mt-3">
            {isRTL ? "الأماكن محدودة" : "Limited spots available"}
          </p>
        </div>
      </div>
    </section>
  );
}
