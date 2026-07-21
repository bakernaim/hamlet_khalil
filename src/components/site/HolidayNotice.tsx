"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import type { SiteSettings } from "@/lib/types";
import {
  parseWorkingSchedule,
  parseWorkingExceptions,
  dayInfo,
  nextOpenDay,
  formatDayHours,
  dateKey,
} from "@/lib/workingHours";

// Shows a one-time (per browser session, per day) dialog when the business is
// closed all day today — a weekend/off day or a holiday exception — letting
// visitors know we'll reply on the next working day.
export default function HolidayNotice({ settings }: { settings: SiteSettings }) {
  const { isRTL } = useLang();
  const [state, setState] = useState<{
    label?: string;
    nextLabel: string;
    nextHours: string;
  } | null>(null);

  useEffect(() => {
    const schedule = parseWorkingSchedule(settings.workingSchedule);
    const exceptions = parseWorkingExceptions(settings.workingExceptions);
    const now = new Date();

    const today = dayInfo(schedule, now, exceptions);
    if (!today.closed) return; // open today — nothing to show

    const storageKey = `hk-holiday-${dateKey(now)}`;
    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* sessionStorage unavailable — still show once */
    }

    const locale = isRTL ? "ar-LB" : "en-US";
    const next = nextOpenDay(schedule, exceptions, now);
    const nextLabel = next
      ? next.date.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })
      : "";
    const nextHours = next ? formatDayHours(next.ranges, isRTL ? "ar" : "en") : "";

    // Runs once on mount — reads browser-only APIs (Date, sessionStorage), so
    // deriving this in an effect is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ label: today.label, nextLabel, nextHours });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state) return null;

  const close = () => setState(null);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-card border border-line shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-brand/25 to-[#0b1828] px-6 pt-7 pb-5 text-center">
          <div className="w-14 h-14 rounded-full bg-black/25 text-3xl flex items-center justify-center mx-auto mb-3">
            🌙
          </div>
          <h3 className="text-white font-bold text-lg leading-snug">
            {state.label
              ? isRTL
                ? `اليوم عطلة: ${state.label}`
                : `Today is a holiday: ${state.label}`
              : isRTL
                ? "نحن مغلقون اليوم"
                : "We're closed today"}
          </h3>
        </div>

        <div className="p-6 text-center">
          <p className="text-muted text-sm leading-relaxed mb-4">
            {isRTL
              ? "شكراً لتواصلكم معنا. سنعاود الرد على استفساركم في يوم العمل التالي."
              : "Thanks for reaching out. We'll get back to your request on the next working day."}
          </p>

          {state.nextLabel && (
            <div className="rounded-xl border border-line bg-page-alt px-4 py-3 mb-5">
              <div className="text-[11px] text-muted mb-0.5">{isRTL ? "يوم العمل التالي" : "Next working day"}</div>
              <div className="text-ink font-semibold text-sm">{state.nextLabel}</div>
              {state.nextHours && <div className="text-accent text-xs mt-0.5">{state.nextHours}</div>}
            </div>
          )}

          <button
            onClick={close}
            className="w-full text-center text-sm font-semibold py-3 rounded-xl bg-brand text-[#040d18] hover:bg-brand-hover transition-colors"
          >
            {isRTL ? "حسناً، فهمت" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}
