"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { waHref } from "@/lib/whatsapp";
import { FREQUENCY_LABEL } from "@/lib/recurrence";
import type { CurrentTripDTO, TripStatus, ZiyaratPackageDTO, TourismPackageDTO } from "@/lib/types";
import Reveal from "@/components/site/Reveal";
import BookingModal from "@/components/site/BookingModal";
import PackageInfoModal from "@/components/site/PackageInfoModal";

type PackageInfo = {
  flag: string;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  image: string;
  infoAr: string;
  infoEn: string;
};

const STATUS_META: Record<
  TripStatus,
  { ar: string; en: string; dot: string; chip: string }
> = {
  OPEN: {
    ar: "التسجيل مفتوح",
    en: "Booking Open",
    dot: "bg-brand",
    chip: "bg-white/85 text-accent border-brand/35 dark:bg-brand/15 dark:text-brand-hover dark:border-brand/30",
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
  ziyarat,
  tourism,
}: {
  trips: CurrentTripDTO[];
  whatsappNumber: string;
  ziyarat: ZiyaratPackageDTO[];
  tourism: TourismPackageDTO[];
}) {
  const { isRTL, lang } = useLang();
  const [bookingTrip, setBookingTrip] = useState<CurrentTripDTO | null>(null);
  const [infoPkg, setInfoPkg] = useState<PackageInfo | null>(null);

  if (trips.length === 0) return null;

  // Lookup for a trip's linked package (by "type-slug"), for the details modal.
  const lookup = new Map<string, PackageInfo>();
  for (const p of ziyarat) lookup.set(`ziyarat-${p.slug}`, p);
  for (const p of tourism) lookup.set(`tourism-${p.slug}`, p);

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  const pkgHtml = (p: PackageInfo) => (isRTL ? p.infoAr || p.infoEn : p.infoEn || p.infoAr);

  return (
    <section id="trips" dir={isRTL ? "rtl" : "ltr"} className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 bg-page-alt pattern-overlay" />
      <div className="absolute top-0 left-0 right-0 gold-divider" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 text-accent text-xs font-medium tracking-[0.2em] uppercase mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
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
            const pkg =
              trip.packageType && trip.packageSlug
                ? lookup.get(`${trip.packageType}-${trip.packageSlug}`)
                : undefined;
            // Fall back to the linked package's photo when the trip has no image.
            const cardImage = trip.image ?? pkg?.image ?? null;
            const packageAnchor =
              trip.packageType && trip.packageSlug
                ? `#${trip.packageType}-${trip.packageSlug}`
                : null;
            const isRecurring = trip.frequency !== "ONCE";
            const nextDate = trip.departures[0] ?? null;
            const hasDates = trip.departures.length > 0;
            const isBookable =
              hasDates && (trip.status === "OPEN" || trip.status === "ALMOST_FULL");
            const showSeats = trip.seatsLeft != null && isBookable;

            return (
              <Reveal key={trip.id} delay={i * 70}>
                <article className="package-card group flex flex-col rounded-2xl overflow-hidden border border-line bg-card h-full">
                  {/* Photo */}
                  <div className="relative h-40 shrink-0 overflow-hidden">
                    {cardImage ? (
                      <Image
                        src={cardImage}
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

                    {/* Recurring badge */}
                    {isRecurring && (
                      <div className="absolute top-3 end-3 inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-sm text-white/85">
                        🔁 {isRTL ? FREQUENCY_LABEL[trip.frequency].ar : FREQUENCY_LABEL[trip.frequency].en}
                      </div>
                    )}

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
                          {isRecurring
                            ? isRTL ? "أقرب موعد: " : "Next: "
                            : isRTL ? "المغادرة: " : "Departs: "}
                          {nextDate ? fmtDate(nextDate) : (isRTL ? "غير متوفر" : "—")}
                        </span>
                      </div>
                      {isRecurring && hasDates ? (
                        <div className="flex items-center gap-2">
                          <span className="text-accent">📆</span>
                          <span>
                            {isRTL
                              ? `${trip.departures.length} مواعيد متاحة`
                              : `${trip.departures.length} dates available`}
                          </span>
                        </div>
                      ) : (
                        trip.returnDate && (
                          <div className="flex items-center gap-2">
                            <span className="text-accent">↩️</span>
                            <span>
                              {isRTL ? "العودة: " : "Returns: "}
                              {fmtDate(trip.returnDate)}
                            </span>
                          </div>
                        )
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

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {isBookable ? (
                        <button
                          onClick={() => setBookingTrip(trip)}
                          className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl bg-brand text-[#040d18] hover:bg-brand-hover transition-colors duration-200 min-h-[42px] flex items-center justify-center"
                        >
                          {isRTL ? "احجز مقعدك" : "Book a Seat"}
                        </button>
                      ) : (
                        <span className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl bg-ink/4 text-muted/70 border border-ink/10 min-h-[42px] flex items-center justify-center">
                          {isRTL ? "غير متاح" : "Unavailable"}
                        </span>
                      )}
                      {pkg && pkgHtml(pkg) ? (
                        <button
                          onClick={() => setInfoPkg(pkg)}
                          className="shrink-0 text-xs font-medium px-3 py-2.5 rounded-xl border border-brand/30 text-accent hover:bg-brand/10 transition-colors min-h-[42px] flex items-center justify-center"
                        >
                          {isRTL ? "تفاصيل الباقة" : "Details"}
                        </button>
                      ) : (
                        packageAnchor && (
                          <a
                            href={packageAnchor}
                            className="shrink-0 text-xs font-medium px-3 py-2.5 rounded-xl border border-brand/30 text-accent hover:bg-brand/10 transition-colors min-h-[42px] flex items-center justify-center"
                          >
                            {isRTL ? "الباقة" : "Package"}
                          </a>
                        )
                      )}
                      <a
                        href={waHref(
                          whatsappNumber,
                          isRTL
                            ? `السلام عليكم، أريد حجز رحلة: ${title}`
                            : `Hello, I'd like to book the trip: ${title}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={isRTL ? "الحجز عبر واتساب" : "Book via WhatsApp"}
                        title={isRTL ? "الحجز عبر واتساب" : "Book via WhatsApp"}
                        className="shrink-0 w-[42px] min-h-[42px] rounded-xl border border-[#25D366]/40 text-[#128C4A] dark:text-[#4ee38a] hover:bg-[#25D366]/10 transition-colors flex items-center justify-center"
                      >
                        <WhatsAppIcon />
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {bookingTrip && (
        <BookingModal
          key={bookingTrip.id}
          open
          onClose={() => setBookingTrip(null)}
          trip={bookingTrip}
          image={
            bookingTrip.image ??
            (bookingTrip.packageType && bookingTrip.packageSlug
              ? lookup.get(`${bookingTrip.packageType}-${bookingTrip.packageSlug}`)?.image ?? null
              : null)
          }
          whatsappNumber={whatsappNumber}
        />
      )}
      {infoPkg && (
        <PackageInfoModal
          open
          onClose={() => setInfoPkg(null)}
          title={isRTL ? infoPkg.nameAr : infoPkg.nameEn}
          flag={infoPkg.flag}
          duration={isRTL ? infoPkg.durationAr : infoPkg.durationEn}
          image={infoPkg.image}
          html={pkgHtml(infoPkg)}
        />
      )}
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.65.14-.19.29-.74.93-.91 1.12-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.44-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.57-.89-2.15-.24-.57-.48-.49-.65-.5l-.56-.01c-.19 0-.51.07-.77.36-.26.29-1.01.99-1.01 2.42 0 1.43 1.03 2.81 1.18 3 .14.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.31.19 1.81.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z" />
    </svg>
  );
}
