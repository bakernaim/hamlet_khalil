"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import type { HotelDTO } from "@/lib/types";
import Reveal from "@/components/site/Reveal";
import HotelBookingModal from "@/components/site/HotelBookingModal";
import ImageCarousel from "@/components/site/ImageCarousel";

export default function HotelBooking({
  hotels,
  whatsappNumber,
}: {
  hotels: HotelDTO[];
  whatsappNumber: string;
}) {
  const { isRTL } = useLang();
  const [selected, setSelected] = useState<HotelDTO | null>(null);
  const [country, setCountry] = useState("ALL");

  const countries = useMemo(() => {
    const seen = new Map<string, string>();
    for (const h of hotels) {
      const key = isRTL ? h.countryAr : h.countryEn;
      if (!seen.has(key)) seen.set(key, key);
    }
    return [...seen.keys()];
  }, [hotels, isRTL]);

  const visible = country === "ALL" ? hotels : hotels.filter((h) => (isRTL ? h.countryAr : h.countryEn) === country);

  if (hotels.length === 0) return null;

  return (
    <section id="hotels" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-page-alt" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "إقامتك بين أيدينا" : "Your Stay, Sorted"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3">
            {isRTL ? "نساعدك في حجز فندقك" : "We help you book your hotel"}
          </h2>
          <p className="text-muted max-w-lg mx-auto text-sm leading-relaxed">
            {isRTL
              ? "اختر من الفنادق التي نتعامل معها في العراق وإيران، وأرسل لنا طلبك — سنتواصل معك عبر واتساب لتأكيد الحجز."
              : "Choose from the hotels we work with in Iraq and Iran, send us your request, and we'll reach out on WhatsApp to confirm your booking."}
          </p>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        {/* Country filter */}
        {countries.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setCountry("ALL")}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                country === "ALL"
                  ? "bg-brand text-[#040d18] border-brand"
                  : "border-line text-soft hover:border-brand/50 hover:text-ink"
              }`}
            >
              {isRTL ? "الكل" : "All"}
            </button>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                  country === c
                    ? "bg-brand text-[#040d18] border-brand"
                    : "border-line text-soft hover:border-brand/50 hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {visible.map((h, i) => {
            const name = isRTL ? h.nameAr : h.nameEn;
            const city = isRTL ? h.cityAr : h.cityEn;
            const countryName = isRTL ? h.countryAr : h.countryEn;
            const address = isRTL ? h.addressAr : h.addressEn;
            const roomTypes = isRTL ? h.roomTypesAr : h.roomTypesEn;
            const gallery = [h.image, ...h.images].filter(Boolean) as string[];
            const meals = [
              h.mealBreakfast && (isRTL ? "فطور" : "Breakfast"),
              h.mealLunch && (isRTL ? "غداء" : "Lunch"),
              h.mealDinner && (isRTL ? "عشاء" : "Dinner"),
            ].filter(Boolean) as string[];

            return (
              <Reveal key={h.id} delay={i * 70}>
                <article className="flex flex-col sm:flex-row rounded-2xl border border-line bg-card overflow-hidden">
                  {gallery.length > 0 && (
                    <div className="relative w-full sm:w-56 h-44 sm:h-auto shrink-0">
                      <ImageCarousel
                        images={gallery}
                        alt={name}
                        className="absolute inset-0"
                        sizes="(max-width:640px) 100vw, 224px"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col sm:flex-row min-w-0">
                    <div className="flex-1 p-5 min-w-0">
                      <div className="text-accent text-[11px] font-medium mb-1.5">
                        📍 {city}, {countryName}
                      </div>
                      <h3 className="text-ink font-bold text-base leading-snug mb-1.5">{name}</h3>
                      {address && <p className="text-muted text-xs leading-relaxed mb-3">{address}</p>}

                      <div className="flex flex-wrap gap-1.5">
                        {roomTypes.map((rt) => (
                          <span key={rt} className="text-[10px] text-soft bg-ink/4 border border-ink/8 px-2 py-0.5 rounded-md">
                            🛏️ {rt}
                          </span>
                        ))}
                        {meals.map((m) => (
                          <span key={m} className="text-[10px] text-accent bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-md">
                            🍽️ {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 sm:w-48 p-5 sm:ps-4 border-t sm:border-t-0 sm:border-s border-line flex flex-col justify-center gap-2">
                      {h.priceStart != null && (
                        <div className="text-ink">
                          <span className="text-[11px] text-muted">{isRTL ? "يبدأ من" : "Starting from"}</span>
                          <div className="font-bold text-lg leading-tight">${h.priceStart.toLocaleString("en-US")}</div>
                        </div>
                      )}
                      <button
                        onClick={() => setSelected(h)}
                        className="w-full text-center text-sm font-semibold py-2.5 rounded-xl bg-brand/10 border border-brand/30 text-accent hover:bg-brand-hover transition-colors duration-200 min-h-[42px] flex items-center justify-center"
                      >
                        {isRTL ? "اطلب الحجز" : "Request Booking"}
                      </button>
                      {h.website && (
                        <a
                          href={h.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center text-xs text-muted hover:text-ink"
                        >
                          {isRTL ? "زيارة موقع الفندق ↗" : "Visit hotel website ↗"}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {selected && (
        <HotelBookingModal
          open
          onClose={() => setSelected(null)}
          hotel={selected}
          whatsappNumber={whatsappNumber}
        />
      )}
    </section>
  );
}
