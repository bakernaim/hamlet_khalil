"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { waHref } from "@/lib/whatsapp";
import type { CurrentTripDTO, TripStatus } from "@/lib/types";
import Reveal from "@/components/site/Reveal";

const STATUS_META: Record<
  TripStatus,
  { ar: string; en: string; dot: string; chip: string }
> = {
  OPEN: {
    ar: "التسجيل مفتوح",
    en: "Booking Open",
    dot: "bg-[#00b86a]",
    chip: "bg-white/85 text-accent border-[#00b86a]/35 dark:bg-[#00b86a]/15 dark:text-[#33d68a] dark:border-[#00b86a]/30",
  },
  ALMOST_FULL: {
    ar: "أوشكت على الاكتمال",
    en: "Almost Full",
    dot: "bg-amber-500 dark:bg-amber-400",
    chip: "bg-white/85 text-amber-700 border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  },
  DEPARTED: {
    ar: "انطلقت",
    en: "Departed",
    dot: "bg-[#9aa8a1] dark:bg-white/40",
    chip: "bg-white/80 text-muted border-ink/10 dark:bg-white/8 dark:text-white/50 dark:border-white/15",
  },
  CLOSED: {
    ar: "مغلقة",
    en: "Closed",
    dot: "bg-[#9aa8a1] dark:bg-white/40",
    chip: "bg-white/80 text-muted border-ink/10 dark:bg-white/8 dark:text-white/50 dark:border-white/15",
  },
};

export default function CurrentTrips({
  trips,
  whatsappNumber,
}: {
  trips: CurrentTripDTO[];
  whatsappNumber: string;
}) {
  const { isRTL, lang } = useLang();

  if (trips.length === 0) return null;

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  const bookMsg = (title: string) =>
    isRTL
      ? `السلام عليكم، أريد حجز مقعد في رحلة: ${title}`
      : `Hello, I'd like to reserve a seat on the trip: ${title}`;

  return (
    <section id="trips" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-page-alt pattern-overlay" />
      <div className="absolute top-0 left-0 right-0 gold-divider" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b86a] opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00b86a]" />
            </span>
            {isRTL ? "الرحلات القادمة" : "Upcoming Departures"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink mb-3">
            {isRTL ? "الرحلات المتاحة الآن" : "Current Trips"}
          </h2>
          <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
            {isRTL
              ? "احجز مقعدك في رحلاتنا القادمة قبل نفاد الأماكن"
              : "Reserve your seat on our upcoming departures before they sell out"}
          </p>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {trips.map((trip, i) => {
            const title = isRTL ? trip.titleAr : trip.titleEn;
            const destination = isRTL ? trip.destinationAr : trip.destinationEn;
            const meta = STATUS_META[trip.status] ?? STATUS_META.OPEN;
            const packageAnchor =
              trip.packageType && trip.packageSlug
                ? `#${trip.packageType}-${trip.packageSlug}`
                : null;
            const isBookable = trip.status === "OPEN" || trip.status === "ALMOST_FULL";
            const showSeats = trip.seatsLeft != null && isBookable;

            return (
              <Reveal key={trip.id} delay={i * 70}>
                <article className="package-card group flex flex-col rounded-2xl overflow-hidden border border-line bg-card h-full">
                  {/* Photo */}
                  <div className="relative h-40 shrink-0 overflow-hidden">
                    {trip.image ? (
                      <Image
                        src={trip.image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#dcebe3] to-[#c4d9cd] dark:from-[#12233c] dark:to-[#0b1828]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/30 dark:from-card via-transparent to-transparent" />

                    {/* Status badge */}
                    <div
                      className={`absolute top-3 start-3 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${meta.chip}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {isRTL ? meta.ar : meta.en}
                    </div>

                    {/* Destination */}
                    <div className="absolute bottom-3 start-3 bg-black/55 backdrop-blur-sm text-white/85 text-[10px] font-medium px-2.5 py-1 rounded-full">
                      📍 {destination}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-ink font-bold text-sm leading-snug flex-1">{title}</h3>
                      <div className="text-end shrink-0">
                        <div className="text-accent text-lg font-bold leading-none">${trip.price}</div>
                        <div className="text-muted/80 text-[10px] mt-0.5">{isRTL ? "/شخص" : "/person"}</div>
                      </div>
                    </div>

                    <div className="h-px bg-line mb-3" />

                    {/* Dates */}
                    <div className="space-y-1.5 text-xs text-soft mb-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-accent">🗓️</span>
                        <span>
                          {isRTL ? "المغادرة: " : "Departs: "}
                          {fmtDate(trip.departureDate)}
                        </span>
                      </div>
                      {trip.returnDate && (
                        <div className="flex items-center gap-2">
                          <span className="text-accent">↩️</span>
                          <span>
                            {isRTL ? "العودة: " : "Returns: "}
                            {fmtDate(trip.returnDate)}
                          </span>
                        </div>
                      )}
                      {showSeats && (
                        <div className="flex items-center gap-2">
                          <span className="text-amber-500 dark:text-amber-400">🎟️</span>
                          <span className={trip.seatsLeft! <= 5 ? "text-amber-600 dark:text-amber-300 font-semibold" : ""}>
                            {isRTL
                              ? `${trip.seatsLeft} مقاعد متبقية`
                              : `${trip.seatsLeft} seats left`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      {isBookable ? (
                        <a
                          href={waHref(whatsappNumber, bookMsg(title))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl bg-[#00b86a] text-[#040d18] hover:bg-[#33d68a] transition-colors duration-200 min-h-[42px] flex items-center justify-center"
                        >
                          {isRTL ? "احجز مقعدك" : "Book a Seat"}
                        </a>
                      ) : (
                        <span className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl bg-ink/4 text-muted/70 border border-ink/10 min-h-[42px] flex items-center justify-center">
                          {isRTL ? "غير متاح" : "Unavailable"}
                        </span>
                      )}
                      {packageAnchor && (
                        <a
                          href={packageAnchor}
                          className="shrink-0 text-xs font-medium px-3 py-2.5 rounded-xl border border-[#00b86a]/30 text-accent hover:bg-[#00b86a]/10 transition-colors min-h-[42px] flex items-center justify-center"
                        >
                          {isRTL ? "الباقة" : "Package"}
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
    </section>
  );
}
