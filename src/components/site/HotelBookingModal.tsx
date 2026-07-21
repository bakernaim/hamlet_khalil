"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { waHref } from "@/lib/whatsapp";
import { HOTEL_ROOM_TYPES, type HotelDTO, type HotelMeal } from "@/lib/types";

// Fallback bilingual labels used only when a hotel has no custom room types.
const FALLBACK_ROOM_LABELS: Record<string, { ar: string; en: string }> = {
  SINGLE: { ar: "مفردة", en: "Single" },
  DOUBLE: { ar: "ثنائية", en: "Double" },
  TRIPLE: { ar: "ثلاثية", en: "Triple" },
  SUITE: { ar: "جناح", en: "Suite" },
};

const MEAL_LABELS: Record<HotelMeal, { ar: string; en: string; icon: string }> = {
  BREAKFAST: { ar: "فطور", en: "Breakfast", icon: "🥐" },
  LUNCH: { ar: "غداء", en: "Lunch", icon: "🍲" },
  DINNER: { ar: "عشاء", en: "Dinner", icon: "🍽️" },
};

export default function HotelBookingModal({
  open,
  onClose,
  hotel,
  whatsappNumber,
}: {
  open: boolean;
  onClose: () => void;
  hotel: HotelDTO;
  whatsappNumber: string;
}) {
  const { isRTL } = useLang();

  // Room type options: the hotel's own list (paired EN/AR), falling back to the
  // generic enum when the hotel defines none. `value` is the language-neutral
  // stored value; `label` follows the current language.
  const roomOptions = useMemo(() => {
    const count = Math.max(hotel.roomTypesEn.length, hotel.roomTypesAr.length);
    const opts = Array.from({ length: count }, (_, i) => {
      const en = hotel.roomTypesEn[i] || "";
      const ar = hotel.roomTypesAr[i] || "";
      return { value: en || ar, label: isRTL ? ar || en : en || ar };
    }).filter((o) => o.value);
    if (opts.length > 0) return opts;
    return HOTEL_ROOM_TYPES.map((rt) => ({
      value: rt,
      label: isRTL ? FALLBACK_ROOM_LABELS[rt].ar : FALLBACK_ROOM_LABELS[rt].en,
    }));
  }, [hotel.roomTypesEn, hotel.roomTypesAr, isRTL]);

  // Meals this hotel offers, in a stable order.
  const offeredMeals = useMemo(
    () =>
      (["BREAKFAST", "LUNCH", "DINNER"] as HotelMeal[]).filter((m) =>
        m === "BREAKFAST" ? hotel.mealBreakfast : m === "LUNCH" ? hotel.mealLunch : hotel.mealDinner
      ),
    [hotel.mealBreakfast, hotel.mealLunch, hotel.mealDinner]
  );

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [nights, setNights] = useState("");
  const [rooms, setRooms] = useState<string[]>([roomOptions[0].value]);
  const [meals, setMeals] = useState<HotelMeal[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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

  const name = isRTL ? hotel.nameAr : hotel.nameEn;
  const city = isRTL ? hotel.cityAr : hotel.cityEn;

  function addRoom() {
    setRooms((prev) => (prev.length >= 20 ? prev : [...prev, roomOptions[0].value]));
  }
  function removeRoom(i: number) {
    setRooms((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }
  function setRoomType(i: number, type: string) {
    setRooms((prev) => prev.map((r, idx) => (idx === i ? type : r)));
  }
  function toggleMeal(m: HotelMeal) {
    setMeals((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) return setError(isRTL ? "يرجى إدخال الاسم" : "Please enter your name");
    if (!phone.trim()) return setError(isRTL ? "يرجى إدخال رقم الهاتف" : "Please enter your phone number");
    if (!checkIn) return setError(isRTL ? "يرجى اختيار تاريخ الوصول" : "Please choose a check-in date");

    setSubmitting(true);
    const res = await fetch("/api/hotel-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId: hotel.id,
        fullName: fullName.trim(),
        phone: phone.trim(),
        checkIn,
        nights: nights.trim() ? Number(nights) : null,
        rooms,
        meals,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) return setError(data.error || (isRTL ? "تعذّر إرسال الطلب" : "Could not submit request"));
    setDone(true);
  }

  const contactMsg = isRTL
    ? `السلام عليكم، أريد الاستفسار عن حجز فندق "${hotel.nameAr}" في ${hotel.cityAr}`
    : `Hello, I'd like to ask about booking "${hotel.nameEn}" in ${hotel.cityEn}`;

  const inputBase =
    "w-full rounded-xl bg-page-alt border border-line text-ink text-sm px-3.5 py-3 outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/25 transition placeholder:text-muted/50";

  if (!open) return null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[80] flex items-start sm:items-center justify-center p-3 sm:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-card border border-line shadow-2xl my-2 overflow-hidden">
        {/* Header */}
        <div className="relative h-28 shrink-0">
          {hotel.image ? (
            <Image src={hotel.image} alt={name} fill className="object-cover" sizes="512px" />
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
            <div className="text-white/70 text-[11px] mb-0.5">🏨 {city}</div>
            <h3 className="text-white font-bold leading-snug drop-shadow pe-10">{name}</h3>
          </div>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-brand/15 text-accent text-4xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <p className="text-ink font-bold text-lg mb-1">
              {isRTL ? "تم استلام طلبك" : "Request received"}
            </p>
            <p className="text-muted text-sm mb-4">
              {isRTL
                ? "سنتواصل معك قريباً لتأكيد التفاصيل والسعر."
                : "We'll reach out soon to confirm details and pricing."}
            </p>
            <a
              href={waHref(whatsappNumber, contactMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-center text-sm font-semibold py-3 rounded-xl bg-[#25D366] text-white hover:brightness-95 transition mb-2"
            >
              <WhatsAppIcon /> {isRTL ? "تواصل معنا عبر واتساب" : "Contact us on WhatsApp"}
            </a>
            <button onClick={onClose} className="text-muted hover:text-ink text-sm py-2">
              {isRTL ? "إغلاق" : "Close"}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-5 space-y-4 max-h-[68vh] overflow-y-auto">
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
              <div className="grid grid-cols-3 gap-2.5">
                <label className="col-span-2 block">
                  <span className="text-[11px] font-medium text-muted block mb-1">
                    {isRTL ? "تاريخ الوصول" : "Check-in date"}
                  </span>
                  <input
                    className={inputBase}
                    type="date"
                    dir="ltr"
                    min={new Date().toISOString().slice(0, 10)}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-medium text-muted block mb-1">
                    {isRTL ? "الليالي" : "Nights"}
                  </span>
                  <input
                    className={inputBase}
                    type="number"
                    min="1"
                    max="365"
                    dir="ltr"
                    placeholder={isRTL ? "اختياري" : "Optional"}
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-ink">
                  🛏️ {isRTL ? "الغرف" : "Rooms"} <span className="text-muted font-normal">({rooms.length})</span>
                </span>
                <button
                  type="button"
                  onClick={addRoom}
                  disabled={rooms.length >= 20}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-brand/30 text-accent hover:bg-brand/10 disabled:opacity-40"
                >
                  + {isRTL ? "إضافة غرفة" : "Add room"}
                </button>
              </div>
              <div className="space-y-2">
                {rooms.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-line bg-page-alt p-2">
                    <span className="text-xs font-medium text-soft w-16 shrink-0 ps-1.5">
                      {isRTL ? `غرفة ${i + 1}` : `Room ${i + 1}`}
                    </span>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {roomOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setRoomType(i, opt.value)}
                          className={`text-[11px] font-semibold px-2.5 py-2 rounded-lg border transition ${
                            r === opt.value
                              ? "bg-brand text-[#040d18] border-brand"
                              : "border-line text-soft hover:border-brand/50 hover:text-ink"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {rooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoom(i)}
                        aria-label={isRTL ? "إزالة الغرفة" : "Remove room"}
                        className="text-red-500/70 hover:text-red-500 text-lg leading-none w-6 h-6 shrink-0"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {offeredMeals.length > 0 && (
              <div>
                <span className="text-sm font-semibold text-ink block mb-2">
                  🍽️ {isRTL ? "الوجبات (اختياري)" : "Meals (optional)"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {offeredMeals.map((m) => {
                    const on = meals.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMeal(m)}
                        aria-pressed={on}
                        className={`text-xs font-semibold px-3 py-2 rounded-xl border transition ${
                          on
                            ? "bg-brand text-[#040d18] border-brand"
                            : "border-line text-soft hover:border-brand/50 hover:text-ink"
                        }`}
                      >
                        {on ? "✓ " : ""}
                        {MEAL_LABELS[m].icon} {isRTL ? MEAL_LABELS[m].ar : MEAL_LABELS[m].en}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.65.14-.19.29-.74.93-.91 1.12-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.44-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.57-.89-2.15-.24-.57-.48-.49-.65-.5l-.56-.01c-.19 0-.51.07-.77.36-.26.29-1.01.99-1.01 2.42 0 1.43 1.03 2.81 1.18 3 .14.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.31.19 1.81.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z" />
    </svg>
  );
}
