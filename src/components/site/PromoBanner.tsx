"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { waHref } from "@/lib/whatsapp";
import type { BannerDTO } from "@/lib/types";

type Countdown = { days: number; hours: number; minutes: number; seconds: number; past: boolean };

function getCountdown(target: Date): Countdown {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
    past: false,
  };
}

// Visual variants; both keep the dark navy base of the site.
const THEMES = {
  amber: {
    overlay: "bg-[#0f0300]/88",
    glow: "bg-amber-700/12",
    badge: "bg-amber-900/30 border-amber-600/35 text-amber-300/80",
    title: "text-amber-300",
    text: "text-amber-200/60",
    digitBox: "border-amber-600/30",
    digitLabel: "text-amber-400/60",
    colon: "text-amber-600/50",
    countLabel: "text-amber-500/55",
    priceBox: "border-amber-600/25",
    price: "text-amber-300",
    priceDivider: "bg-amber-600/25",
  },
  green: {
    overlay: "bg-[#02120a]/88",
    glow: "bg-[#00b86a]/12",
    badge: "bg-[#00b86a]/12 border-[#00b86a]/35 text-[#33d68a]/90",
    title: "text-[#33d68a]",
    text: "text-white/60",
    digitBox: "border-[#00b86a]/30",
    digitLabel: "text-[#33d68a]/60",
    colon: "text-[#00b86a]/50",
    countLabel: "text-[#33d68a]/55",
    priceBox: "border-[#00b86a]/25",
    price: "text-[#33d68a]",
    priceDivider: "bg-[#00b86a]/25",
  },
} as const;

function DigitBox({ value, label, t }: { value: number; label: string; t: (typeof THEMES)[keyof typeof THEMES] }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`bg-black/50 border rounded-xl px-3 sm:px-4 py-2 sm:py-3 min-w-[52px] sm:min-w-[64px] text-center backdrop-blur-sm ${t.digitBox}`}>
        <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className={`text-[10px] sm:text-xs ${t.digitLabel}`}>{label}</span>
    </div>
  );
}

export default function PromoBanner({
  banner,
  whatsappNumber,
}: {
  banner: BannerDTO;
  whatsappNumber: string;
}) {
  const { isRTL } = useLang();
  const t = THEMES[banner.theme === "amber" ? "amber" : "green"];

  const title = isRTL ? banner.titleAr : banner.titleEn;
  const badge = isRTL ? banner.badgeAr : banner.badgeEn;
  const text = isRTL ? banner.textAr : banner.textEn;
  const note = isRTL ? banner.noteAr : banner.noteEn;
  const cta = (isRTL ? banner.ctaAr : banner.ctaEn) || (isRTL ? "تواصل معنا" : "Contact Us");

  // Tick only after mount so the server render never mismatches.
  const [cd, setCd] = useState<Countdown | null>(null);
  useEffect(() => {
    if (!banner.targetDate) return;
    const tick = () => setCd(getCountdown(new Date(banner.targetDate!)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [banner.targetDate]);

  const msg = encodeURIComponent(
    isRTL ? `السلام عليكم، أريد الاستفسار عن: ${banner.titleAr}` : `Hello, I'd like to ask about: ${banner.titleEn}`
  );

  const L = isRTL
    ? { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" }
    : { days: "Days", hours: "Hours", minutes: "Mins", seconds: "Secs" };

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {banner.image ? (
          <Image src={banner.image} alt={title} fill className="object-cover object-center" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1828] to-[#040d18]" />
        )}
        <div className={`absolute inset-0 ${t.overlay}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040d18]/70 to-transparent" />
      </div>

      {/* Soft glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-3/4 h-64 rounded-full blur-[80px] ${t.glow}`} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {badge && (
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-5 backdrop-blur-sm ${t.badge}`}>
            <span className="text-[10px] sm:text-xs font-medium tracking-widest uppercase">{badge}</span>
          </div>
        )}

        <h2 className={`text-2xl sm:text-4xl font-bold mb-3 ${t.title}`}>{title}</h2>

        <p className={`text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed ${t.text}`}>{text}</p>

        {/* Countdown (only when a future target date is set) */}
        {cd && !cd.past && (
          <div className="mb-8">
            <p className={`text-[10px] sm:text-xs mb-4 uppercase tracking-widest ${t.countLabel}`}>
              {isRTL ? "الوقت المتبقي" : "Countdown"}
            </p>
            <div className="flex gap-2 sm:gap-4 justify-center items-start">
              <DigitBox value={cd.days} label={L.days} t={t} />
              <span className={`text-xl sm:text-2xl font-bold mt-2 ${t.colon}`}>:</span>
              <DigitBox value={cd.hours} label={L.hours} t={t} />
              <span className={`text-xl sm:text-2xl font-bold mt-2 ${t.colon}`}>:</span>
              <DigitBox value={cd.minutes} label={L.minutes} t={t} />
              <span className={`text-xl sm:text-2xl font-bold mt-2 ${t.colon}`}>:</span>
              <DigitBox value={cd.seconds} label={L.seconds} t={t} />
            </div>
          </div>
        )}

        {/* Price box */}
        {banner.priceFrom != null && (
          <div className={`inline-flex items-center gap-3 sm:gap-4 bg-black/40 border rounded-2xl px-5 sm:px-7 py-3 sm:py-4 mb-7 backdrop-blur-sm ${t.priceBox}`}>
            <div>
              <div className="text-white/45 text-xs">{isRTL ? "يبدأ من" : "From"}</div>
              <div className={`text-2xl sm:text-3xl font-bold ${t.price}`}>
                ${banner.priceFrom.toLocaleString("en-US")}
              </div>
            </div>
            {note && (
              <>
                <div className={`w-px h-8 ${t.priceDivider}`} />
                <div className="text-white/55 text-xs text-start max-w-[160px]">{note}</div>
              </>
            )}
          </div>
        )}

        {/* CTA — WhatsApp */}
        <div>
          <a
            href={`${waHref(whatsappNumber)}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm sm:text-base px-7 sm:px-9 py-3.5 rounded-full transition-colors duration-200 min-h-[48px] whatsapp-pulse"
          >
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {cta}
          </a>
        </div>
      </div>
    </section>
  );
}
