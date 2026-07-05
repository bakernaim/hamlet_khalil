"use client";

import { useMemo, useState } from "react";
import { useResource } from "@/components/admin/useResource";
import { Button, ErrorText, Select } from "@/components/admin/ui";
import type { BookingDTO, BookingStatus, RoomType } from "@/lib/types";

const dayKey = (iso: string) => iso.slice(0, 10); // YYYY-MM-DD

const STATUS_META: Record<BookingStatus, { label: string; chip: string }> = {
  PENDING: { label: "Pending", chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30" },
  CONFIRMED: { label: "Confirmed", chip: "bg-brand/15 text-accent border border-brand/30" },
  CANCELLED: { label: "Cancelled", chip: "bg-ink/8 text-ink/45 border border-line" },
};

const ROOM_LABELS: Record<RoomType, string> = {
  SINGLE: "Single room",
  DOUBLE: "Double room",
  TRIPLE: "Triple room",
  QUAD: "Quad room",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export default function BookingsManager() {
  const { items, loading, error, reload, remove } = useResource<BookingDTO>("/api/admin/bookings");
  const [filter, setFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [tripFilter, setTripFilter] = useState("ALL"); // by trip/package (snapshot title)
  const [dateFilter, setDateFilter] = useState("ALL"); // by departure day
  const [busyId, setBusyId] = useState<string | null>(null);

  // Distinct trips and departure dates present in the bookings, for the dropdowns.
  const tripOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const b of items) {
      const key = b.tripTitleEn || b.tripTitleAr || "—";
      if (!seen.has(key)) seen.set(key, key);
    }
    return [...seen.keys()].sort();
  }, [items]);

  const dateOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const b of items) seen.add(dayKey(b.departureDate));
    return [...seen].sort();
  }, [items]);

  // Rows matching the trip + date filters (status chips + counts scope to this).
  const scoped = useMemo(
    () =>
      items.filter(
        (b) =>
          (tripFilter === "ALL" || (b.tripTitleEn || b.tripTitleAr) === tripFilter) &&
          (dateFilter === "ALL" || dayKey(b.departureDate) === dateFilter)
      ),
    [items, tripFilter, dateFilter]
  );

  const counts = useMemo(() => {
    const c = { PENDING: 0, CONFIRMED: 0, CANCELLED: 0 };
    for (const b of scoped) c[b.status]++;
    return c;
  }, [scoped]);

  const visible = filter === "ALL" ? scoped : scoped.filter((b) => b.status === filter);
  const filtersActive = tripFilter !== "ALL" || dateFilter !== "ALL" || filter !== "ALL";

  async function setStatus(b: BookingDTO, status: BookingStatus) {
    setBusyId(b.id);
    const res = await fetch(`/api/admin/bookings/${b.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Update failed");
      return;
    }
    reload();
  }

  async function onDelete(b: BookingDTO) {
    if (!confirm(`Delete the booking from "${b.fullName}"? This also deletes its passport files.`)) return;
    setBusyId(b.id);
    const res = await remove(b.id);
    setBusyId(null);
    if (!res.ok) alert(res.error);
  }

  const FILTERS: { key: "ALL" | BookingStatus; label: string }[] = [
    { key: "ALL", label: `All (${scoped.length})` },
    { key: "PENDING", label: `Pending (${counts.PENDING})` },
    { key: "CONFIRMED", label: `Confirmed (${counts.CONFIRMED})` },
    { key: "CANCELLED", label: `Cancelled (${counts.CANCELLED})` },
  ];

  function clearFilters() {
    setFilter("ALL");
    setTripFilter("ALL");
    setDateFilter("ALL");
  }

  return (
    <div>
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-ink">Bookings</h1>
          {counts.PENDING > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              {counts.PENDING} awaiting confirmation
            </span>
          )}
        </div>
        <p className="text-ink/45 text-sm mt-1">
          Booking requests from the website. New requests start as <span className="text-amber-600 dark:text-amber-300">Pending</span> —
          confirm once payment is received.
        </p>
      </header>

      <ErrorText>{error}</ErrorText>

      {/* Trip / package + departure-date filters */}
      <div className="flex flex-wrap items-end gap-3 mb-3">
        <label className="block">
          <span className="block text-[11px] font-medium text-ink/50 mb-1">Trip / package</span>
          <Select value={tripFilter} onChange={(e) => setTripFilter(e.target.value)} className="min-w-52">
            <option value="ALL">All trips</option>
            {tripOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </label>
        <label className="block">
          <span className="block text-[11px] font-medium text-ink/50 mb-1">Departure date</span>
          <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="min-w-44">
            <option value="ALL">All dates</option>
            {dateOptions.map((d) => (
              <option key={d} value={d}>{fmtDate(d)}</option>
            ))}
          </Select>
        </label>
        {filtersActive && (
          <button onClick={clearFilters} className="text-xs font-medium px-3 py-2 rounded-lg border border-line text-ink/55 hover:text-ink hover:bg-ink/5">
            Clear filters
          </button>
        )}
        <button onClick={() => reload()} className="text-xs font-medium px-3 py-2 rounded-lg border border-line text-ink/55 hover:text-ink hover:bg-ink/5 ms-auto">
          ↻ Refresh
        </button>
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              filter === f.key
                ? "bg-brand/15 text-accent border-brand/30"
                : "border-line text-ink/55 hover:text-ink hover:bg-ink/5"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-ink/40 text-sm">
          No bookings{filtersActive ? " match these filters" : " yet"}.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((b) => {
            const meta = STATUS_META[b.status];
            const busy = busyId === b.id;
            return (
              <div
                key={b.id}
                className={`rounded-2xl border bg-card p-4 sm:p-5 ${
                  b.status === "PENDING" ? "border-amber-500/40" : "border-line"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-ink font-semibold">{b.fullName}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${meta.chip}`}>{meta.label}</span>
                      <span className="text-ink/35 text-[11px]">{timeAgo(b.createdAt)}</span>
                    </div>
                    <div className="text-ink/60 text-sm mt-1">
                      {b.tripTitleEn || b.tripTitleAr} · <span className="text-accent">{fmtDate(b.departureDate)}</span>
                    </div>
                    <div className="text-ink/50 text-xs mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>👥 {b.partySize} {b.partySize === 1 ? "traveler" : "travelers"}</span>
                      {b.roomType && <span>🛏️ {ROOM_LABELS[b.roomType]}</span>}
                      <a href={`tel:${b.phone}`} className="hover:text-ink">📞 {b.phone}</a>
                      <a
                        href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        WhatsApp
                      </a>
                    </div>
                    {b.notes && <p className="text-ink/50 text-xs mt-2 italic">“{b.notes}”</p>}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex gap-2">
                      {b.status !== "CONFIRMED" && (
                        <Button onClick={() => setStatus(b, "CONFIRMED")} disabled={busy} className="!py-1.5 !px-3 text-xs">
                          Confirm
                        </Button>
                      )}
                      {b.status !== "CANCELLED" && (
                        <Button variant="ghost" onClick={() => setStatus(b, "CANCELLED")} disabled={busy} className="!py-1.5 !px-3 text-xs">
                          Cancel
                        </Button>
                      )}
                      {b.status !== "PENDING" && (
                        <Button variant="ghost" onClick={() => setStatus(b, "PENDING")} disabled={busy} className="!py-1.5 !px-3 text-xs">
                          Reopen
                        </Button>
                      )}
                    </div>
                    <button
                      onClick={() => onDelete(b)}
                      disabled={busy}
                      className="text-red-600/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/25 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Passports */}
                {b.passports.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-line">
                    <div className="text-ink/45 text-[11px] mb-2">Passports ({b.passports.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {b.passports.map((token, i) => (
                        <a
                          key={token}
                          href={`/api/admin/passport/${token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative w-20 h-14 rounded-lg overflow-hidden border border-line bg-page-alt"
                          title={`Passport ${i + 1} — open full size`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/admin/passport/${token}`}
                            alt={`Passport ${i + 1}`}
                            className="w-full h-full object-cover group-hover:opacity-80"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
