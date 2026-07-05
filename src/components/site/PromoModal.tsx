"use client";

// A promo banner with displayMode "modal": pops up over the homepage shortly
// after load, once per browser session (sessionStorage). Shares the dark
// accent theming with the thin PromoBanner bar; the uploaded image (optional)
// becomes the header photo.

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { waHref } from "@/lib/whatsapp";
import { promoTheme } from "@/components/site/PromoBanner";
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

export default function PromoModal({
  banner,
  whatsappNumber,
}: {
  banner: BannerDTO;
  whatsappNumber: string;
}) {
  const { isRTL } = useLang();
  const t = promoTheme(banner.theme);
  const [open, setOpen] = useState(false);

  const storageKey = `promoModalSeen:${banner.id}`;

  // Open once per session, after a beat so it doesn't fight the hero entrance.
  useEffect(() => {
    if (sessionStorage.getItem(storageKey)) return;
    const id = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(id);
  }, [storageKey]);

  const close = useCallback(() => {
    sessionStorage.setItem(storageKey, "1");
    setOpen(false);
  }, [storageKey]);

  // Close on Escape + lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  // Live countdown while open.
  const [cd, setCd] = useState<Countdown | null>(null);
  useEffect(() => {
    if (!open || !banner.targetDate) return;
    const tick = () => setCd(getCountdown(new Date(banner.targetDate!)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [open, banner.targetDate]);

  if (!open) return null;

  const title = isRTL ? banner.titleAr : banner.titleEn;
  const badge = isRTL ? banner.badgeAr : banner.badgeEn;
  const text = isRTL ? banner.textAr : banner.textEn;
  const note = isRTL ? banner.noteAr : banner.noteEn;
  const cta = (isRTL ? banner.ctaAr : banner.ctaEn) || (isRTL ? "احجز الآن" : "Book Now");

  const msg = encodeURIComponent(
    isRTL ? `السلام عليكم، أريد الاستفسار عن: ${banner.titleAr}` : `Hello, I'd like to ask about: ${banner.titleEn}`
  );

  const units = cd && !cd.past
    ? [
        { v: String(cd.days),     l: isRTL ? "يوم"   : "Days" },
        { v: pad(cd.hours),       l: isRTL ? "ساعة"  : "Hrs" },
        { v: pad(cd.minutes),     l: isRTL ? "دقيقة" : "Min" },
        { v: pad(cd.seconds),     l: isRTL ? "ثانية" : "Sec" },
      ]
    : null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm promo-modal-fade" onClick={close} />

      <div className={`promo-modal-pop relative z-10 w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-b ${t.bg}`}>
        {/* Header photo (falls back to a glowing gradient) */}
        <div className="relative h-40 sm:h-44">
          {banner.image ? (
            <>
              <Image src={banner.image} alt={title} fill className="object-cover" sizes="448px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            </>
          ) : (
            <div className={`absolute -top-16 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-80 h-48 rounded-full blur-3xl ${t.glow}`} />
          )}
          <button
            onClick={close}
            aria-label={isRTL ? "إغلاق" : "Close"}
            className="absolute top-3 end-3 z-10 grid place-items-center w-9 h-9 rounded-full bg-black/50 text-white/90 hover:bg-black/70 text-xl leading-none backdrop-blur-sm"
          >
            ×
          </button>
          <div className="absolute bottom-4 inset-x-5">
            {badge && (
              <span className={`inline-flex items-center gap-1.5 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${t.badge}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${t.dot}`} />
                {badge}
              </span>
            )}
            <h3 className={`font-bold text-xl sm:text-2xl leading-snug drop-shadow ${t.title}`}>{title}</h3>
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-6 pt-4 space-y-4">
          {text && <p className={`text-sm leading-relaxed ${t.text}`}>{text}</p>}

          {/* Countdown */}
          {units && (
            <div className="grid grid-cols-4 gap-2 text-center text-white tabular-nums">
              {units.map((u) => (
                <div key={u.l} className={`rounded-xl border py-2 ${t.box}`}>
                  <div className="font-bold text-lg leading-none">{u.v}</div>
                  <div className="text-white/45 text-[10px] mt-1">{u.l}</div>
                </div>
              ))}
            </div>
          )}

          {/* Price */}
          {banner.priceFrom != null && (
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-white/45 text-xs">{isRTL ? "يبدأ من" : "From"}</span>
              <span className={`font-bold text-2xl ${t.price}`}>
                ${banner.priceFrom.toLocaleString("en-US")}
              </span>
              {note && <span className="text-white/45 text-xs">· {note}</span>}
            </div>
          )}

          {/* CTA — WhatsApp */}
          <a
            href={`${waHref(whatsappNumber)}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold text-sm px-5 py-3 rounded-full transition-all shadow-[0_0_18px_rgba(34,197,94,0.35)] hover:shadow-[0_0_26px_rgba(34,197,94,0.55)]"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {cta}
          </a>

          <button
            type="button"
            onClick={close}
            className="block w-full text-center text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            {isRTL ? "لاحقاً" : "Maybe later"}
          </button>
        </div>
      </div>
    </div>
  );
}
