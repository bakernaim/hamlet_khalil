"use client";

import { useEffect, useState } from "react";
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

const pad = (n: number) => String(n).padStart(2, "0");

// Accent classes per theme for the thin bar (dark gradient background + accent text).
export const PROMO_THEMES = {
  amber: {
    bg: "from-[#1e1002] via-[#140900] to-[#0b0500]",
    glow: "bg-amber-500/30",
    line: "via-amber-400/60",
    dot: "bg-amber-400",
    badge: "text-amber-300/90",
    title: "text-amber-100",
    text: "text-amber-100/55",
    price: "text-amber-300",
    box: "border-amber-500/30 bg-amber-500/[0.08]",
  },
  green: {
    bg: "from-[#03170e] via-[#02110a] to-[#010905]",
    glow: "bg-brand/30",
    line: "via-brand/60",
    dot: "bg-brand",
    badge: "text-brand-hover/90",
    title: "text-brand-hover",
    text: "text-white/55",
    price: "text-brand-hover",
    box: "border-brand/30 bg-brand/[0.08]",
  },
} as const;

export const promoTheme = (theme: string) => PROMO_THEMES[theme === "amber" ? "amber" : "green"];

// One promo rendered as a thin, single-row bar (used inside the fixed bottom
// carousel). The outer carousel reserves space on the left (close button) and
// the bottom-right (floating WhatsApp FAB), so content stays clear of both.
export default function PromoBanner({
  banner,
  whatsappNumber,
}: {
  banner: BannerDTO;
  whatsappNumber: string;
}) {
  const { isRTL } = useLang();
  const t = promoTheme(banner.theme);

  const title = isRTL ? banner.titleAr : banner.titleEn;
  const badge = isRTL ? banner.badgeAr : banner.badgeEn;
  const text = isRTL ? banner.textAr : banner.textEn;
  const cta = (isRTL ? banner.ctaAr : banner.ctaEn) || (isRTL ? "احجز الآن" : "Book Now");

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

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`relative h-full overflow-hidden bg-gradient-to-r ${t.bg}`}>
      {/* Thin accent line along the top edge */}
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${t.line} to-transparent`} />
      {/* Soft accent glow behind the content */}
      <div className={`pointer-events-none absolute -top-12 start-1/4 w-72 h-28 rounded-full blur-3xl ${t.glow}`} />
      {/* Light sheen that periodically sweeps across the bar */}
      <div className="pointer-events-none absolute inset-y-0 w-40 promo-sheen bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* pl-9 clears the close button, pr-16 clears the floating WhatsApp button. */}
      <div className="relative h-full flex items-center gap-3 sm:gap-5 max-w-6xl mx-auto pl-9 pr-16 sm:pr-20">
        {/* Badge with a pulsing live dot */}
        {badge && (
          <span className="hidden md:inline-flex items-center gap-1.5 shrink-0">
            <span className="relative flex w-2 h-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${t.dot}`} />
              <span className={`relative inline-flex w-2 h-2 rounded-full ${t.dot}`} />
            </span>
            <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${t.badge}`}>{badge}</span>
          </span>
        )}

        {/* Title + subtext */}
        <div className="min-w-0 flex-1">
          <h3 className={`truncate font-bold text-sm sm:text-base ${t.title}`}>{title}</h3>
          {text && <p className={`truncate text-xs mt-0.5 hidden sm:block ${t.text}`}>{text}</p>}
        </div>

        {/* Compact labeled countdown */}
        {cd && !cd.past && (
          <div className="hidden md:flex items-center gap-1.5 shrink-0 text-white tabular-nums font-semibold text-sm">
            <span className={`px-2 py-1 rounded-md border ${t.box}`}>
              {cd.days}
              <span className="text-white/45 text-[10px] ms-0.5">{isRTL ? "يوم" : "d"}</span>
            </span>
            <span className={`px-2 py-1 rounded-md border ${t.box}`}>
              {pad(cd.hours)}:{pad(cd.minutes)}:{pad(cd.seconds)}
            </span>
          </div>
        )}

        {/* Price */}
        {banner.priceFrom != null && (
          <div className="hidden sm:flex flex-col items-end leading-none shrink-0">
            <span className="text-white/45 text-[10px]">{isRTL ? "يبدأ من" : "From"}</span>
            <span className={`font-bold text-base ${t.price}`}>
              ${banner.priceFrom.toLocaleString("en-US")}
            </span>
          </div>
        )}

        {/* CTA — WhatsApp */}
        <a
          href={`${waHref(whatsappNumber)}?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all shadow-[0_0_18px_rgba(34,197,94,0.35)] hover:shadow-[0_0_26px_rgba(34,197,94,0.55)] hover:scale-[1.03]"
        >
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="whitespace-nowrap">{cta}</span>
        </a>
      </div>
    </div>
  );
}
