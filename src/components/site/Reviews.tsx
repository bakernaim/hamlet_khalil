"use client";

// Visitor reviews: shows approved reviews from the DB and lets anyone submit a
// new one (hidden until an admin approves it from the dashboard).

import { useEffect, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import type { ReviewDTO, SectionCopy } from "@/lib/types";

const PREVIEW_COUNT = 6;

function Stars({ n, className = "" }: { n: number; className?: string }) {
  return (
    <div className={`flex gap-0.5 text-amber-500 dark:text-amber-400 text-sm ${className}`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < n ? "" : "opacity-25"}>★</span>
      ))}
    </div>
  );
}

export default function Reviews({ reviews, copy }: { reviews: ReviewDTO[]; copy: SectionCopy }) {
  const { isRTL, lang } = useLang();
  const [showAll, setShowAll] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const visible = showAll ? reviews : reviews.slice(0, PREVIEW_COUNT);

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { month: "long", year: "numeric" }).format(
      new Date(iso)
    );

  return (
    <section id="reviews" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-page-alt pattern-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "آراء الحجاج" : "Reviews"}
          </span>
          {/* h2 → Reem Kufi */}
          <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3">
            {isRTL ? copy.titleAr : copy.titleEn}
          </h2>
          {(isRTL ? copy.descAr : copy.descEn) && (
            <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
              {isRTL ? copy.descAr : copy.descEn}
            </p>
          )}
          <div className="section-divider w-16 mx-auto mt-5" />
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full border border-brand/40 text-accent hover:bg-brand/10 transition"
          >
            ✍️ {isRTL ? "أضف رأيك" : "Write a review"}
          </button>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-muted text-sm">
            {isRTL ? "كن أول من يشارك رأيه في رحلاتنا." : "Be the first to share your experience."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {visible.map((r) => (
              <div
                key={r.id}
                className="flex flex-col rounded-2xl p-5 sm:p-6 border border-line hover:border-brand/35 transition-colors bg-card"
              >
                <Stars n={r.rating} className="mb-3" />

                {/* Quote — Cairo body font */}
                <p className="text-soft text-sm leading-7 flex-1 mb-5">{r.text}</p>

                <div className="flex items-center gap-3 border-t border-line pt-4">
                  <div className="w-9 h-9 rounded-full bg-brand/12 border border-brand/25 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-ink font-semibold text-sm truncate">{r.name}</div>
                    <div className="text-accent/80 text-xs mt-0.5 truncate">
                      {r.tripLabel || fmtDate(r.createdAt)}
                    </div>
                  </div>
                  <span className="ms-auto text-muted/60 text-[11px] shrink-0">{fmtDate(r.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showAll && reviews.length > PREVIEW_COUNT && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-sm font-semibold px-5 py-2.5 rounded-full border border-line text-soft hover:text-ink hover:border-brand/40 transition"
            >
              {isRTL ? `عرض كل الآراء (${reviews.length})` : `Show all reviews (${reviews.length})`}
            </button>
          </div>
        )}
      </div>

      {formOpen && <ReviewForm onClose={() => setFormOpen(false)} />}
    </section>
  );
}

function ReviewForm({ onClose }: { onClose: () => void }) {
  const { isRTL } = useLang();
  const [name, setName] = useState("");
  const [tripLabel, setTripLabel] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Close on Escape + lock page scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError(isRTL ? "يرجى إدخال اسمك" : "Please enter your name");
    if (!text.trim()) return setError(isRTL ? "يرجى كتابة رأيك" : "Please write your review");

    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        tripLabel: tripLabel.trim() || undefined,
        rating,
        text: text.trim(),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) return setError(data.error || (isRTL ? "تعذّر إرسال الرأي" : "Could not submit your review"));
    setDone(true);
  }

  const inputBase =
    "w-full rounded-xl bg-page-alt border border-line text-ink text-sm px-3.5 py-3 outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/25 transition placeholder:text-muted/50";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isRTL ? "أضف رأيك" : "Write a review"}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-card border border-line shadow-2xl p-6">
        <button
          onClick={onClose}
          aria-label={isRTL ? "إغلاق" : "Close"}
          className="absolute top-4 end-4 w-8 h-8 rounded-full bg-ink/5 hover:bg-ink/10 text-muted hover:text-ink text-lg leading-none"
        >
          ×
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-brand/15 text-accent text-3xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <p className="text-ink font-bold mb-1">{isRTL ? "شكراً لك!" : "Thank you!"}</p>
            <p className="text-muted text-sm mb-5">
              {isRTL
                ? "تم استلام رأيك وسيظهر على الموقع بعد المراجعة."
                : "Your review was received and will appear on the site after a quick check."}
            </p>
            <button
              onClick={onClose}
              className="text-sm font-semibold px-6 py-2.5 rounded-full bg-brand text-[#040d18] hover:bg-brand-hover transition"
            >
              {isRTL ? "إغلاق" : "Close"}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3.5">
            <h3 className="text-ink font-bold text-lg">{isRTL ? "أضف رأيك" : "Write a review"}</h3>

            {/* Star picker */}
            <div className="flex items-center gap-1.5" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  aria-label={`${s} ★`}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    s <= (hover || rating) ? "text-amber-500 dark:text-amber-400" : "text-ink/20"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <input
              className={inputBase}
              placeholder={isRTL ? "اسمك" : "Your name"}
              value={name}
              maxLength={80}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={inputBase}
              placeholder={isRTL ? "أي رحلة؟ (اختياري)" : "Which trip? (optional)"}
              value={tripLabel}
              maxLength={120}
              onChange={(e) => setTripLabel(e.target.value)}
            />
            <textarea
              className={inputBase}
              rows={4}
              placeholder={isRTL ? "اكتب رأيك هنا…" : "Share your experience…"}
              value={text}
              maxLength={1200}
              onChange={(e) => setText(e.target.value)}
            />

            {error && (
              <p className="text-sm text-red-600 dark:text-red-300 bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="block w-full text-center text-sm font-bold py-3 rounded-xl bg-brand text-[#040d18] hover:bg-brand-hover transition disabled:opacity-60"
            >
              {submitting ? (isRTL ? "جارٍ الإرسال…" : "Submitting…") : (isRTL ? "إرسال" : "Submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
