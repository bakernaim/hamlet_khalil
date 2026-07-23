"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { waHref } from "@/lib/whatsapp";
import type { HotelDTO, SectionCopy } from "@/lib/types";
import Reveal from "@/components/site/Reveal";
import HotelBookingModal from "@/components/site/HotelBookingModal";
import ImageCarousel from "@/components/site/ImageCarousel";
import { SearchBox, FilterSelect, Pager, PAGE_SIZES } from "@/components/site/SearchPager";

export default function HotelBooking({
  hotels,
  whatsappNumber,
  copy,
}: {
  hotels: HotelDTO[];
  whatsappNumber: string;
  copy: SectionCopy;
}) {
  const { isRTL } = useLang();
  const [selected, setSelected] = useState<HotelDTO | null>(null);
  const [roomSel, setRoomSel] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const resetPage = () => setPage(1);

  // Room-type dropdown options — only values in the data, current language.
  const roomOptions = useMemo(() => {
    const set = new Set<string>();
    for (const h of hotels) for (const rt of isRTL ? h.roomTypesAr : h.roomTypesEn) set.add(rt);
    return [...set].filter(Boolean).sort();
  }, [hotels, isRTL]);

  // Autocomplete suggestions for the free-text name / address fields.
  const nameSuggestions = useMemo(
    () => [...new Set(hotels.map((h) => (isRTL ? h.nameAr : h.nameEn)).filter(Boolean))].sort(),
    [hotels, isRTL]
  );
  const addressSuggestions = useMemo(
    () => [...new Set(hotels.map((h) => (isRTL ? h.addressAr : h.addressEn) ?? "").filter(Boolean))].sort(),
    [hotels, isRTL]
  );

  // Room type = exact match on either language; name/address = substring match.
  const filtered = useMemo(() => {
    const nq = nameQuery.trim().toLowerCase();
    const aq = addressQuery.trim().toLowerCase();
    return hotels.filter((h) => {
      const roomOk = !roomSel || h.roomTypesEn.includes(roomSel) || h.roomTypesAr.includes(roomSel);
      const nameOk = !nq || `${h.nameEn} ${h.nameAr}`.toLowerCase().includes(nq);
      const addrOk = !aq || `${h.addressEn ?? ""} ${h.addressAr ?? ""}`.toLowerCase().includes(aq);
      return roomOk && nameOk && addrOk;
    });
  }, [hotels, roomSel, nameQuery, addressQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            {isRTL ? copy.titleAr : copy.titleEn}
          </h2>
          <p className="text-muted max-w-lg mx-auto text-sm leading-relaxed">
            {isRTL ? copy.descAr : copy.descEn}
          </p>
          <div className="section-divider w-16 mx-auto mt-5" />
        </div>

        {/* Advanced search */}
        <div className="max-w-4xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <FilterSelect
            label={isRTL ? "نوع الغرفة" : "Room type"}
            value={roomSel}
            onChange={(v) => { setRoomSel(v); resetPage(); }}
            options={roomOptions}
            allLabel={isRTL ? "الكل" : "All"}
          />
          <div>
            <span className="block text-[11px] font-medium text-muted mb-1">{isRTL ? "اسم الفندق" : "Hotel name"}</span>
            <SearchBox
              value={nameQuery}
              onChange={(v) => { setNameQuery(v); resetPage(); }}
              suggestions={nameSuggestions}
              placeholder={isRTL ? "اسم الفندق…" : "Hotel name…"}
            />
          </div>
          <div>
            <span className="block text-[11px] font-medium text-muted mb-1">{isRTL ? "العنوان" : "Address"}</span>
            <SearchBox
              value={addressQuery}
              onChange={(v) => { setAddressQuery(v); resetPage(); }}
              suggestions={addressSuggestions}
              placeholder={isRTL ? "العنوان…" : "Address…"}
            />
          </div>
          <p className="sm:col-span-3 text-center text-xs text-muted">
            {isRTL ? "لا تجد ما تبحث عنه؟ " : "Can't find what you're looking for? "}
            <a
              href={waHref(
                whatsappNumber,
                isRTL ? "السلام عليكم، أبحث عن فندق غير متوفر في الموقع" : "Hello, I'm looking for a hotel not listed on the site"
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
            <div className="text-3xl mb-3">🏨</div>
            <p className="text-ink font-semibold mb-1">
              {isRTL ? "لا توجد فنادق مطابقة لبحثك" : "No hotels match your search"}
            </p>
            <p className="text-muted text-sm mb-5">
              {isRTL
                ? "تواصل معنا عبر واتساب للمزيد من الفنادق والأماكن."
                : "Contact us on WhatsApp for more hotels and places."}
            </p>
            <a
              href={waHref(
                whatsappNumber,
                isRTL
                  ? `السلام عليكم، أبحث عن فندق${nameQuery ? ` باسم "${nameQuery}"` : ""}${roomSel ? ` بنوع غرفة ${roomSel}` : ""}${addressQuery ? ` في ${addressQuery}` : ""}`
                  : `Hello, I'm looking for a hotel${nameQuery ? ` named "${nameQuery}"` : ""}${roomSel ? ` with ${roomSel} room` : ""}${addressQuery ? ` in ${addressQuery}` : ""}`
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
                <article className="group flex flex-col sm:flex-row rounded-xl border border-line bg-card overflow-hidden hover:border-brand/40 hover:shadow-sm transition-all">
                  {gallery.length > 0 && (
                    <div className="relative w-full sm:w-44 h-32 sm:h-auto shrink-0">
                      <ImageCarousel
                        images={gallery}
                        alt={name}
                        className="absolute inset-0"
                        imageClassName="group-hover:scale-[1.03] transition-transform duration-500"
                        sizes="(max-width:640px) 100vw, 176px"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col sm:flex-row min-w-0">
                    <div className="flex-1 p-3.5 min-w-0">
                      <div className="text-accent text-[10px] font-medium mb-0.5">
                        📍 {city}, {countryName}
                      </div>
                      <h3 className="text-ink font-bold text-sm leading-snug mb-1 truncate">{name}</h3>
                      {address && <p className="text-muted text-[11px] leading-relaxed mb-2 line-clamp-1">{address}</p>}

                      <div className="flex flex-wrap gap-1">
                        {roomTypes.map((rt) => (
                          <span key={rt} className="text-[10px] text-soft bg-ink/4 border border-ink/8 px-1.5 py-0.5 rounded">
                            🛏️ {rt}
                          </span>
                        ))}
                        {meals.map((m) => (
                          <span key={m} className="text-[10px] text-accent bg-brand/10 border border-brand/20 px-1.5 py-0.5 rounded">
                            🍽️ {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 sm:w-40 p-3.5 sm:ps-3 border-t sm:border-t-0 sm:border-s border-line flex flex-row sm:flex-col items-center sm:items-stretch justify-between gap-3 sm:justify-center">
                      {h.priceStart != null && (
                        <div className="text-ink shrink-0 sm:text-center">
                          <span className="text-[10px] text-muted block leading-none mb-0.5">
                            {isRTL ? "يبدأ من" : "From"}
                          </span>
                          <span className="font-bold text-base leading-none">${h.priceStart.toLocaleString("en-US")}</span>
                        </div>
                      )}
                      <div className="flex flex-col items-stretch gap-1 sm:w-full min-w-0">
                        <button
                          onClick={() => setSelected(h)}
                          className="text-center text-xs font-semibold px-4 py-2 rounded-lg bg-brand/10 border border-brand/30 text-accent hover:bg-brand hover:text-[#040d18] transition-colors duration-200 whitespace-nowrap"
                        >
                          {isRTL ? "احجز" : "Book"}
                        </button>
                        {h.website && (
                          <a
                            href={h.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-center text-[10px] text-muted hover:text-ink"
                          >
                            {isRTL ? "الموقع ↗" : "Website ↗"}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
          <div className="max-w-4xl mx-auto w-full">
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
        </div>
        )}
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
