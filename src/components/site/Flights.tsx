"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { waHref } from "@/lib/whatsapp";
import type { FlightDTO, SectionCopy } from "@/lib/types";
import Reveal from "@/components/site/Reveal";
import FlightBookingModal from "@/components/site/FlightBookingModal";
import { FilterSelect, Pager, PAGE_SIZES } from "@/components/site/SearchPager";

export default function Flights({
  flights,
  whatsappNumber,
  copy,
}: {
  flights: FlightDTO[];
  whatsappNumber: string;
  copy: SectionCopy;
}) {
  const { isRTL } = useLang();
  const [selected, setSelected] = useState<FlightDTO | null>(null);
  const [fromSel, setFromSel] = useState("");
  const [toSel, setToSel] = useState("");
  const [airlineSel, setAirlineSel] = useState("");
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  // Dropdown options — only values that exist in the data, current language.
  const fromOptions = useMemo(
    () => [...new Set(flights.map((f) => (isRTL ? f.fromAr : f.fromEn)).filter(Boolean))].sort(),
    [flights, isRTL]
  );
  const toOptions = useMemo(
    () => [...new Set(flights.map((f) => (isRTL ? f.toAr : f.toEn)).filter(Boolean))].sort(),
    [flights, isRTL]
  );
  const airlineOptions = useMemo(
    () => [...new Set(flights.map((f) => (isRTL ? f.airlineAr : f.airlineEn)).filter(Boolean))].sort(),
    [flights, isRTL]
  );

  const resetPage = () => setPage(1);

  // Match the selected value against either language so a chosen option keeps
  // working after a language switch.
  const filtered = useMemo(() => {
    return flights.filter(
      (f) =>
        (!fromSel || f.fromEn === fromSel || f.fromAr === fromSel) &&
        (!toSel || f.toEn === toSel || f.toAr === toSel) &&
        (!airlineSel || f.airlineEn === airlineSel || f.airlineAr === airlineSel)
    );
  }, [flights, fromSel, toSel, airlineSel]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            {isRTL ? copy.titleAr : copy.titleEn}
          </h2>
          <p className="text-muted max-w-lg mx-auto text-sm leading-relaxed">
            {isRTL ? copy.descAr : copy.descEn}
          </p>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        {/* Advanced search */}
        <div className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-3">
          <FilterSelect
            label={isRTL ? "من" : "From"}
            value={fromSel}
            onChange={(v) => { setFromSel(v); resetPage(); }}
            options={fromOptions}
            allLabel={isRTL ? "الكل" : "All"}
          />
          <FilterSelect
            label={isRTL ? "الوجهة" : "Destination"}
            value={toSel}
            onChange={(v) => { setToSel(v); resetPage(); }}
            options={toOptions}
            allLabel={isRTL ? "الكل" : "All"}
          />
          <FilterSelect
            label={isRTL ? "شركة الطيران" : "Airline"}
            value={airlineSel}
            onChange={(v) => { setAirlineSel(v); resetPage(); }}
            options={airlineOptions}
            allLabel={isRTL ? "الكل" : "All"}
          />
          <p className="basis-full text-center text-xs text-muted">
            {isRTL ? "لا تجد ما تبحث عنه؟ " : "Can't find what you're looking for? "}
            <a
              href={waHref(
                whatsappNumber,
                isRTL ? "السلام عليكم، أبحث عن تذكرة طيران غير متوفرة في الموقع" : "Hello, I'm looking for a flight ticket not listed on the site"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-medium hover:underline"
            >
              {isRTL ? "تواصل معنا عبر واتساب — سنجد ما تحتاجه." : "Contact us on WhatsApp — we can find what you need."}
            </a>
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="max-w-lg mx-auto text-center rounded-2xl border border-line bg-card p-8">
            <div className="text-3xl mb-3">✈️</div>
            <p className="text-ink font-semibold mb-1">
              {isRTL ? "لا توجد رحلات مطابقة لبحثك" : "No flights match your search"}
            </p>
            <p className="text-muted text-sm mb-5">
              {isRTL
                ? "تواصل معنا عبر واتساب للمزيد من التذاكر والوجهات."
                : "Contact us on WhatsApp for more tickets and destinations."}
            </p>
            <a
              href={waHref(
                whatsappNumber,
                isRTL
                  ? `السلام عليكم، أبحث عن تذكرة طيران${fromSel ? ` من ${fromSel}` : ""}${toSel ? ` إلى ${toSel}` : ""}${airlineSel ? ` (${airlineSel})` : ""}`
                  : `Hello, I'm looking for a flight ticket${fromSel ? ` from ${fromSel}` : ""}${toSel ? ` to ${toSel}` : ""}${airlineSel ? ` (${airlineSel})` : ""}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold py-3 px-6 rounded-xl bg-[#25D366] text-white hover:brightness-95 transition"
            >
              {isRTL ? "تواصل معنا عبر واتساب" : "Contact us on WhatsApp"}
            </a>
          </div>
        ) : (
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {visible.map((f, i) => {
            const from = isRTL ? f.fromAr : f.fromEn;
            const to = isRTL ? f.toAr : f.toEn;
            const airline = isRTL ? f.airlineAr : f.airlineEn;

            return (
              <Reveal key={f.id} delay={i * 70}>
                <article className="group flex flex-col sm:flex-row rounded-xl border border-line bg-card overflow-hidden hover:border-brand/40 hover:shadow-sm transition-all">
                  {f.image && (
                    <div className="relative w-full sm:w-36 h-28 sm:h-auto shrink-0">
                      <Image
                        src={f.image}
                        alt={airline}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        sizes="(max-width:640px) 100vw, 144px"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col sm:flex-row min-w-0">
                    <div className="flex-1 p-3.5 min-w-0 flex flex-col justify-center">
                      {/* Route */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-ink font-bold text-sm leading-snug">{from}</span>
                        <span className="text-accent">✈</span>
                        <span className="text-ink font-bold text-sm leading-snug">{to}</span>
                      </div>

                      <div className="text-accent text-[11px] font-medium mb-2">🛫 {airline}</div>

                      <span
                        className={`inline-block w-fit text-[10px] px-1.5 py-0.5 rounded border ${
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

                    <div className="shrink-0 sm:w-40 p-3.5 sm:ps-3 border-t sm:border-t-0 sm:border-s border-line flex flex-row sm:flex-col items-center sm:items-stretch justify-between sm:justify-center gap-3">
                      <div className="text-ink shrink-0 sm:text-center">
                        <span className="text-[10px] text-muted block leading-none mb-0.5">{isRTL ? "يبدأ من" : "From"}</span>
                        <span className="font-bold text-base leading-none">${f.price.toLocaleString("en-US")}</span>
                      </div>
                      <button
                        onClick={() => setSelected(f)}
                        className="text-center text-xs font-semibold px-5 py-2 rounded-lg bg-brand/10 border border-brand/30 text-accent hover:bg-brand hover:text-[#040d18] transition-colors duration-200 whitespace-nowrap sm:w-full"
                      >
                        {isRTL ? "احجز" : "Book"}
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
          <Pager
            page={currentPage}
            pageSize={pageSize}
            total={filtered.length}
            onPage={setPage}
            onPageSize={(n) => {
              setPageSize(n);
              setPage(1);
            }}
            isRTL={isRTL}
          />
        </div>
        )}
      </div>

      {selected && (
        <FlightBookingModal open onClose={() => setSelected(null)} flight={selected} whatsappNumber={whatsappNumber} />
      )}
    </section>
  );
}
