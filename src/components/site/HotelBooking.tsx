"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import type { HotelDTO } from "@/lib/types";
import Reveal from "@/components/site/Reveal";
import HotelBookingModal from "@/components/site/HotelBookingModal";

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {visible.map((h, i) => {
            const name = isRTL ? h.nameAr : h.nameEn;
            const city = isRTL ? h.cityAr : h.cityEn;
            const countryName = isRTL ? h.countryAr : h.countryEn;
            const address = isRTL ? h.addressAr : h.addressEn;
            const roomTypes = isRTL ? h.roomTypesAr : h.roomTypesEn;

            return (
              <Reveal key={h.id} delay={i * 70}>
                <article className="flex flex-col rounded-2xl border border-line bg-card h-full overflow-hidden">
                  {h.image && (
                    <div className="relative h-36 shrink-0">
                      <Image src={h.image} alt={name} fill className="object-cover" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-5">
                  <div className="text-accent text-[11px] font-medium mb-1.5">
                    📍 {city}, {countryName}
                  </div>
                  <h3 className="text-ink font-bold text-base leading-snug mb-1.5">{name}</h3>
                  {address && <p className="text-muted text-xs leading-relaxed mb-3">{address}</p>}

                  {roomTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {roomTypes.map((rt) => (
                        <span key={rt} className="text-[10px] text-soft bg-ink/4 border border-ink/8 px-2 py-0.5 rounded-md">
                          🛏️ {rt}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex flex-col gap-2 pt-1">
                    <button
                      onClick={() => setSelected(h)}
                      className="block w-full text-center text-sm font-semibold py-3 rounded-xl bg-brand text-[#040d18] hover:bg-brand-hover transition-colors duration-200"
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
