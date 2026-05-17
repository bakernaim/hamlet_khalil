"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { WHATSAPP_URL } from "@/data/content";

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
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative bg-black/40 border border-[#00b86a]/30 rounded-xl px-4 py-3 min-w-[64px] text-center backdrop-blur-sm overflow-hidden">
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00b86a]/5 to-transparent" />
        <span className="relative text-3xl sm:text-4xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[#00b86a]/60 text-xs font-medium">{label}</span>
    </div>
  );
}

export default function ArbaeenBanner() {
  const { isRTL } = useLang();
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
    <section dir={isRTL ? "rtl" : "ltr"} className="relative py-24 px-4 overflow-hidden">
      {/* Arbaeen crowd real photo as backdrop */}
      <div className="absolute inset-0">
        <Image
          src="/shrines/arbaeen-crowd.jpg"
          alt="Arbaeen Pilgrimage Karbala"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Very heavy overlay to darken & color the photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0500]/90 via-[#0f0300]/85 to-[#06091e]/92" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06091e]/70 via-transparent to-[#06091e]/50" />
      </div>
      <div className="absolute inset-0 pattern-overlay opacity-30" />

      {/* Amber light from center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80%] h-80 rounded-full bg-amber-700/15 blur-[80px]" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-40 rounded-full bg-[#00b86a]/10 blur-[60px] pointer-events-none" />

      {/* Islamic geometric circles (decorative) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border-2 border-[#00b86a] rotate-slow" />
        <div className="absolute w-[450px] h-[450px] rounded-full border border-[#00b86a]" style={{ animation: 'rotate-slow 40s linear infinite reverse' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Karbala flags row */}
        <div className="flex justify-center gap-3 mb-6 text-3xl">
          <span>🏴</span><span>🕌</span><span>🏴</span>
        </div>

        {/* Ornamental badge */}
        <div className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-600/40 rounded-full px-6 py-2 mb-6 backdrop-blur-sm">
          <span className="text-amber-400/80 text-xs">✦</span>
          <span className="text-amber-300/90 text-xs font-semibold tracking-widest uppercase">
            {isRTL ? "أعظم موكب في التاريخ" : "The Greatest March in History"}
          </span>
          <span className="text-amber-400/80 text-xs">✦</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
          <span style={{
            background: 'linear-gradient(90deg, #e8a020 0%, #f5c842 40%, #fff0b0 50%, #f5c842 60%, #e8a020 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {isRTL ? "موكب الأربعين ٢٠٢٥" : "Arbaeen 2025 Convoy"}
          </span>
        </h2>

        <p className="text-amber-200/65 text-sm sm:text-base mb-10 max-w-lg mx-auto leading-relaxed">
          {isRTL
            ? "انضم إلى الملايين في أكبر تجمع بشري على وجه الأرض — كربلاء المقدسة"
            : "Join millions in the largest human gathering on Earth — Holy Karbala"}
        </p>

        {/* Countdown */}
        {!cd.past && (
          <div className="mb-10">
            <p className="text-amber-500/60 text-xs mb-5 uppercase tracking-[0.25em]">
              {isRTL ? "الوقت المتبقي على الأربعين" : "Time Remaining to Arbaeen"}
            </p>
            <div className="flex gap-4 sm:gap-6 justify-center items-start flex-wrap">
              <DigitBox value={cd.days}    label={L.days} />
              <span className="text-[#00b86a]/40 text-3xl font-bold mt-3">:</span>
              <DigitBox value={cd.hours}   label={L.hours} />
              <span className="text-[#00b86a]/40 text-3xl font-bold mt-3">:</span>
              <DigitBox value={cd.minutes} label={L.minutes} />
              <span className="text-[#00b86a]/40 text-3xl font-bold mt-3">:</span>
              <DigitBox value={cd.seconds} label={L.seconds} />
            </div>
          </div>
        )}

        {/* Price card */}
        <div className="inline-flex items-center gap-4 bg-black/35 border border-amber-600/25 rounded-2xl px-8 py-4 mb-8 backdrop-blur-sm">
          <div className="text-end">
            <div className="text-white/50 text-xs">{isRTL ? "السعر يبدأ من" : "Price starts from"}</div>
            <div className="text-3xl font-bold text-amber-300">$1,100</div>
          </div>
          <div className="w-px h-10 bg-amber-600/30" />
          <div className="text-start space-y-1">
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <span className="text-amber-400">✦</span> {isRTL ? "١٤ يوماً" : "14 Days"}
            </div>
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <span className="text-amber-400">✦</span> {isRTL ? "شامل كل شيء" : "All Inclusive"}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div>
          <a
            href={`${WHATSAPP_URL}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-700 via-green-600 to-green-700 hover:from-green-600 hover:via-green-500 hover:to-green-600 text-white font-bold text-base px-10 py-4 rounded-full transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-600/25 whatsapp-pulse"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {isRTL ? "سجّل مكانك الآن" : "Reserve Your Spot Now"}
          </a>
          <p className="text-white/30 text-xs mt-3">
            {isRTL ? "⚡ الأماكن محدودة — الأولوية للمسجلين مسبقاً" : "⚡ Limited spots — Priority for early registrations"}
          </p>
        </div>
      </div>
    </section>
  );
}
