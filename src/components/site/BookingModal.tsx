"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { waHref } from "@/lib/whatsapp";
import type { CurrentTripDTO } from "@/lib/types";

type Passport = { token: string; preview: string; uploading: boolean; error: string };

const emptyPassport = (): Passport => ({ token: "", preview: "", uploading: false, error: "" });

export default function BookingModal({
  open,
  onClose,
  trip,
  image,
  whatsappNumber,
}: {
  open: boolean;
  onClose: () => void;
  trip: CurrentTripDTO;
  image: string | null;
  whatsappNumber: string;
}) {
  const { isRTL, lang } = useLang();

  const [date, setDate] = useState(trip.departures[0] ?? "");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [passports, setPassports] = useState<Passport[]>([emptyPassport()]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showAllDates, setShowAllDates] = useState(false);
  const fileInputs = useRef<(HTMLInputElement | null)[]>([]);

  const DATE_PREVIEW = 4;

  const partySize = passports.length;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  function setPartySize(n: number) {
    const size = Math.max(1, Math.min(30, n));
    setPassports((prev) => {
      if (size === prev.length) return prev;
      if (size < prev.length) return prev.slice(0, size);
      return [...prev, ...Array.from({ length: size - prev.length }, emptyPassport)];
    });
  }

  async function uploadPassport(index: number, file: File) {
    setPassports((prev) => prev.map((p, i) => (i === index ? { ...p, uploading: true, error: "" } : p)));
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/booking/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPassports((prev) =>
          prev.map((p, i) => (i === index ? { ...p, uploading: false, error: data.error || "Upload failed" } : p))
        );
        return;
      }
      const preview = URL.createObjectURL(file);
      setPassports((prev) =>
        prev.map((p, i) => (i === index ? { token: data.token, preview, uploading: false, error: "" } : p))
      );
    } catch {
      setPassports((prev) =>
        prev.map((p, i) => (i === index ? { ...p, uploading: false, error: "Network error" } : p))
      );
    }
  }

  const uploadedCount = passports.filter((p) => p.token).length;
  const allUploaded = uploadedCount === partySize;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!date) return setError(isRTL ? "يرجى اختيار تاريخ المغادرة" : "Please choose a departure date");
    if (!fullName.trim()) return setError(isRTL ? "يرجى إدخال الاسم" : "Please enter your name");
    if (!phone.trim()) return setError(isRTL ? "يرجى إدخال رقم الهاتف" : "Please enter your phone number");
    if (!allUploaded)
      return setError(isRTL ? "يرجى رفع صورة جواز سفر لكل مسافر" : "Please upload a passport image for every traveler");

    setSubmitting(true);
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tripId: trip.id,
        departureDate: date,
        fullName: fullName.trim(),
        phone: phone.trim(),
        partySize,
        passports: passports.map((p) => p.token),
        notes: notes.trim() || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) return setError(data.error || (isRTL ? "تعذّر إرسال الحجز" : "Could not submit booking"));
    setDone(true);
  }

  const title = isRTL ? trip.titleAr : trip.titleEn;
  const destination = isRTL ? trip.destinationAr : trip.destinationEn;

  const contactMsg = isRTL
    ? `السلام عليكم، أريد الاستفسار عن حجز رحلة "${trip.titleAr}"${date ? ` بتاريخ ${fmtDate(date)}` : ""}`
    : `Hello, I'd like to ask about booking "${trip.titleEn}"${date ? ` on ${fmtDate(date)}` : ""}`;
  const paymentMsg = isRTL
    ? `السلام عليكم، لقد حجزت رحلة "${trip.titleAr}" بتاريخ ${date ? fmtDate(date) : ""} وأرغب بإرسال إثبات الدفع.`
    : `Hello, I booked "${trip.titleEn}" on ${date ? fmtDate(date) : ""} and would like to send my payment confirmation.`;

  const inputBase =
    "w-full rounded-xl bg-page-alt border border-line text-ink text-sm px-3.5 py-3 outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/25 transition placeholder:text-muted/50";

  if (!open) return null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[80] flex items-start sm:items-center justify-center p-3 sm:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-card border border-line shadow-2xl my-2 overflow-hidden">
        {/* Trip banner */}
        <div className="relative h-28 shrink-0">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover" sizes="512px" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand/30 to-[#0b1828]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <button
            onClick={onClose}
            aria-label={isRTL ? "إغلاق" : "Close"}
            className="absolute top-3 end-3 w-9 h-9 rounded-full bg-black/45 text-white/90 hover:bg-black/70 text-xl leading-none backdrop-blur-sm"
          >
            ×
          </button>
          <div className="absolute bottom-3 inset-x-4">
            <div className="text-white/70 text-[11px] mb-0.5">📍 {destination}</div>
            <h3 className="text-white font-bold leading-snug drop-shadow">{title}</h3>
          </div>
          <div className="absolute top-3 start-4 bg-brand text-[#040d18] text-xs font-bold px-2.5 py-1 rounded-full">
            ${trip.price} <span className="font-medium">/ {isRTL ? "شخص" : "person"}</span>
          </div>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-brand/15 text-accent text-4xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <p className="text-ink font-bold text-lg mb-1">
              {isRTL ? "تم استلام طلب حجزك" : "Booking request received"}
            </p>
            <p className="text-muted text-sm mb-4">
              {isRTL ? `${title} · ${date ? fmtDate(date) : ""}` : `${title} · ${date ? fmtDate(date) : ""}`}
            </p>
            <div className="text-sm text-soft leading-relaxed rounded-2xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 mb-4 text-start">
              <span className="text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1.5 mb-1">
                ⏳ {isRTL ? "مطلوب الدفع خلال ٢٤ ساعة" : "Payment required within 24 hours"}
              </span>
              {isRTL
                ? "يرجى إرسال الدفعة خلال ٢٤ ساعة، وإلا سيتم إلغاء الحجز تلقائياً. سنتواصل معك لتأكيد التفاصيل."
                : "Please send your payment within 24 hours or your reservation will be automatically cancelled. We'll contact you to confirm the details."}
            </div>
            <a
              href={waHref(whatsappNumber, paymentMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-center text-sm font-semibold py-3 rounded-xl bg-[#25D366] text-white hover:brightness-95 transition mb-2"
            >
              <WhatsAppIcon /> {isRTL ? "إرسال إثبات الدفع عبر واتساب" : "Send payment via WhatsApp"}
            </a>
            <button onClick={onClose} className="text-muted hover:text-ink text-sm py-2">
              {isRTL ? "إغلاق" : "Close"}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-5 space-y-5 max-h-[68vh] overflow-y-auto">
            {/* Step 1 — date */}
            <Section n="1" label={isRTL ? "اختر تاريخ المغادرة" : "Choose a departure date"}>
              {trip.departures.length === 0 ? (
                <p className="text-muted text-sm">{isRTL ? "لا توجد تواريخ متاحة حالياً" : "No available dates right now"}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(showAllDates ? trip.departures : trip.departures.slice(0, DATE_PREVIEW)).map((iso) => {
                    const selected = date === iso;
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setDate(iso)}
                        className={`text-xs font-medium px-3 py-2 rounded-xl border transition ${
                          selected
                            ? "bg-brand text-[#040d18] border-brand shadow-sm"
                            : "border-line text-soft hover:border-brand/50 hover:text-ink"
                        }`}
                      >
                        {selected && <span className="me-1">✓</span>}
                        {fmtDate(iso)}
                      </button>
                    );
                  })}
                  {!showAllDates && trip.departures.length > DATE_PREVIEW && (
                    <button
                      type="button"
                      onClick={() => setShowAllDates(true)}
                      className="text-xs font-semibold px-3 py-2 rounded-xl border border-dashed border-brand/40 text-accent hover:bg-brand/10 transition"
                    >
                      {isRTL
                        ? `+${trip.departures.length - DATE_PREVIEW} مواعيد أخرى`
                        : `+${trip.departures.length - DATE_PREVIEW} more dates`}
                    </button>
                  )}
                </div>
              )}
            </Section>

            {/* Step 2 — details */}
            <Section n="2" label={isRTL ? "بياناتك" : "Your details"}>
              <div className="space-y-2.5">
                <div className="relative">
                  <span className="absolute inset-y-0 start-3 flex items-center text-muted/60 text-sm pointer-events-none">👤</span>
                  <input
                    className={`${inputBase} ps-9`}
                    placeholder={isRTL ? "الاسم الكامل" : "Full name"}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 start-3 flex items-center text-muted/60 text-sm pointer-events-none">📱</span>
                  <input
                    className={`${inputBase} ps-9`}
                    type="tel"
                    dir="ltr"
                    placeholder={isRTL ? "رقم الهاتف / واتساب" : "Phone / WhatsApp number"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-page-alt border border-line px-3.5 py-2.5">
                  <span className="text-sm text-soft">👥 {isRTL ? "عدد المسافرين" : "Travelers"}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPartySize(partySize - 1)}
                      disabled={partySize <= 1}
                      className="w-9 h-9 rounded-lg border border-line text-ink hover:bg-ink/5 text-xl leading-none disabled:opacity-40"
                      aria-label={isRTL ? "إنقاص" : "Decrease"}
                    >
                      −
                    </button>
                    <span className="text-ink font-bold w-6 text-center text-lg">{partySize}</span>
                    <button
                      type="button"
                      onClick={() => setPartySize(partySize + 1)}
                      className="w-9 h-9 rounded-lg border border-line text-ink hover:bg-ink/5 text-xl leading-none"
                      aria-label={isRTL ? "زيادة" : "Increase"}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </Section>

            {/* Step 3 — passports */}
            <Section
              n="3"
              label={isRTL ? "صور جوازات السفر" : "Passport photos"}
              badge={`${uploadedCount}/${partySize}`}
              badgeOk={allUploaded}
            >
              <p className="text-muted text-[11px] mb-2 flex items-center gap-1">
                🔒 {isRTL
                  ? "صورة جواز سفر واحدة لكل مسافر — تُحفظ بشكل خاص وآمن."
                  : "One passport per traveler — stored privately and securely."}
              </p>
              <div className="space-y-2">
                {passports.map((p, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl border p-2 transition ${
                      p.token ? "border-brand/40 bg-brand/5" : "border-line bg-page-alt"
                    }`}
                  >
                    <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-card border border-line shrink-0">
                      {p.preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.preview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-muted/50 text-lg">🛂</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-soft">
                        {isRTL ? `المسافر ${i + 1}` : `Traveler ${i + 1}`}
                      </div>
                      {p.token ? (
                        <div className="text-accent text-[11px]">✓ {isRTL ? "تم الرفع" : "Uploaded"}</div>
                      ) : p.error ? (
                        <div className="text-[11px] text-red-500">{p.error}</div>
                      ) : (
                        <div className="text-muted/70 text-[11px]">{isRTL ? "مطلوب" : "Required"}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputs.current[i]?.click()}
                      disabled={p.uploading}
                      className="text-xs font-semibold px-3 py-2 rounded-lg border border-brand/30 text-accent hover:bg-brand/10 shrink-0 disabled:opacity-50"
                    >
                      {p.uploading ? "…" : p.token ? (isRTL ? "تغيير" : "Change") : (isRTL ? "رفع" : "Upload")}
                    </button>
                    <input
                      ref={(el) => {
                        fileInputs.current[i] = el;
                      }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) uploadPassport(i, f);
                      }}
                    />
                  </div>
                ))}
              </div>
            </Section>

            <textarea
              className={inputBase}
              rows={2}
              placeholder={isRTL ? "ملاحظات إضافية (اختياري)" : "Additional notes (optional)"}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {error && (
              <p className="text-sm text-red-600 dark:text-red-300 bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="block w-full text-center text-sm font-bold py-3.5 rounded-xl bg-brand text-[#040d18] hover:bg-brand-hover transition disabled:opacity-60"
            >
              {submitting ? (isRTL ? "جارٍ الإرسال…" : "Submitting…") : (isRTL ? "إرسال طلب الحجز" : "Submit Booking Request")}
            </button>
            <p className="text-muted text-[11px] text-center -mt-1">
              {isRTL
                ? "بعد الإرسال، يجب إتمام الدفع خلال ٢٤ ساعة لتأكيد الحجز."
                : "After submitting, payment must be completed within 24 hours to confirm your seat."}
            </p>

            {/* WhatsApp alternative */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px bg-line flex-1" />
              <span className="text-muted/70 text-[11px]">{isRTL ? "أو" : "or"}</span>
              <div className="h-px bg-line flex-1" />
            </div>
            <a
              href={waHref(whatsappNumber, contactMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-center text-sm font-semibold py-3 rounded-xl border border-[#25D366]/40 text-[#128C4A] dark:text-[#4ee38a] hover:bg-[#25D366]/10 transition"
            >
              <WhatsAppIcon /> {isRTL ? "تواصل معنا عبر واتساب" : "Contact us on WhatsApp"}
            </a>
          </form>
        )}
      </div>
    </div>
  );
}

function Section({
  n,
  label,
  badge,
  badgeOk,
  children,
}: {
  n: string;
  label: string;
  badge?: string;
  badgeOk?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-5 h-5 rounded-full bg-brand/15 text-accent text-[11px] font-bold flex items-center justify-center">
          {n}
        </span>
        <span className="text-sm font-semibold text-ink flex-1">{label}</span>
        {badge && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              badgeOk ? "bg-brand/15 text-accent" : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.65.14-.19.29-.74.93-.91 1.12-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.44-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.57-.89-2.15-.24-.57-.48-.49-.65-.5l-.56-.01c-.19 0-.51.07-.77.36-.26.29-1.01.99-1.01 2.42 0 1.43 1.03 2.81 1.18 3 .14.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.31.19 1.81.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z" />
    </svg>
  );
}
