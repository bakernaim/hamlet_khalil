"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import type { FlightDTO } from "@/lib/types";
import Reveal from "@/components/site/Reveal";
import FlightBookingModal from "@/components/site/FlightBookingModal";

export default function Flights({
  flights,
  whatsappNumber,
}: {
  flights: FlightDTO[];
  whatsappNumber: string;
}) {
  const { isRTL } = useLang();
  const [selected, setSelected] = useState<FlightDTO | null>(null);
  const [dest, setDest] = useState("ALL");

  const destinations = useMemo(() => {
    const seen = new Set<string>();
    for (const f of flights) seen.add(isRTL ? f.toAr : f.toEn);
    return [...seen];
  }, [flights, isRTL]);

  const visible = dest === "ALL" ? flights : flights.filter((f) => (isRTL ? f.toAr : f.toEn) === dest);

  if (flights.length === 0) return null;

  return (
    <section id="flights" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-page" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2 block">
            {isRTL ? "تذاكر الطيران" : "Plane Tickets"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3">
            {isRTL ? "نحجز لك تذكرة طيرانك" : "We book your flight ticket"}
          </h2>
          <p className="text-muted max-w-lg mx-auto text-sm leading-relaxed">
            {isRTL
              ? "اختر رحلتك، حدّد التاريخ، وأرسل لنا طلبك — سنتواصل معك عبر واتساب لتأكيد الحجز والسعر."
              : "Pick your flight, choose a date, and send us your request — we'll reach out on WhatsApp to confirm the booking and price."}
          </p>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        {/* Destination filter */}
        {destinations.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setDest("ALL")}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                dest === "ALL"
                  ? "bg-brand text-[#040d18] border-brand"
                  : "border-line text-soft hover:border-brand/50 hover:text-ink"
              }`}
            >
              {isRTL ? "الكل" : "All"}
            </button>
            {destinations.map((d) => (
              <button
                key={d}
                onClick={() => setDest(d)}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                  dest === d
                    ? "bg-brand text-[#040d18] border-brand"
                    : "border-line text-soft hover:border-brand/50 hover:text-ink"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {visible.map((f, i) => {
            const from = isRTL ? f.fromAr : f.fromEn;
            const to = isRTL ? f.toAr : f.toEn;
            const airline = isRTL ? f.airlineAr : f.airlineEn;

            return (
              <Reveal key={f.id} delay={i * 70}>
                <article className="flex flex-col sm:flex-row rounded-2xl border border-line bg-card overflow-hidden">
                  {f.image && (
                    <div className="relative w-full sm:w-48 h-36 sm:h-auto shrink-0">
                      <Image src={f.image} alt={airline} fill className="object-cover" sizes="(max-width:640px) 100vw, 192px" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col sm:flex-row min-w-0">
                    <div className="flex-1 p-5 min-w-0">
                      {/* Route */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-ink font-bold text-base leading-snug">{from}</span>
                        <span className="text-accent text-lg">✈</span>
                        <span className="text-ink font-bold text-base leading-snug">{to}</span>
                      </div>

                      <div className="text-accent text-[11px] font-medium mb-3">🛫 {airline}</div>

                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-md border ${
                          f.mealIncluded
                            ? "text-accent bg-brand/10 border-brand/20"
                            : "text-soft bg-ink/4 border-ink/8"
                        }`}
                      >
                        {f.mealIncluded
                          ? isRTL ? "🍽️ وجبة مشمولة" : "🍽️ Meal included"
                          : isRTL ? "🚫 بدون وجبة" : "🚫 No meal"}
                      </span>
                    </div>

                    <div className="shrink-0 sm:w-48 p-5 sm:ps-4 border-t sm:border-t-0 sm:border-s border-line flex flex-col justify-center gap-2">
                      <div className="text-ink">
                        <span className="text-[11px] text-muted">{isRTL ? "يبدأ من" : "Starting from"}</span>
                        <div className="font-bold text-lg leading-tight">${f.price.toLocaleString("en-US")}</div>
                      </div>
                      <button
                        onClick={() => setSelected(f)}
                        className="w-full text-center text-sm font-semibold py-2.5 rounded-xl bg-brand/10 border border-brand/30 text-accent hover:bg-brand-hover transition-colors duration-200 min-h-[42px] flex items-center justify-center"
                      >
                        {isRTL ? "اطلب الحجز" : "Request Booking"}
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {selected && (
        <FlightBookingModal open onClose={() => setSelected(null)} flight={selected} whatsappNumber={whatsappNumber} />
      )}
    </section>
  );
}
