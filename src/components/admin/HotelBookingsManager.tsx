"use client";

import { useMemo, useState } from "react";
import { useResource } from "@/components/admin/useResource";
import { Button, ErrorText } from "@/components/admin/ui";
import type { HotelBookingRequestDTO, HotelBookingStatus, HotelMeal } from "@/lib/types";

const STATUS_META: Record<HotelBookingStatus, { label: string; chip: string }> = {
  PENDING: { label: "Pending", chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30" },
  CONTACTED: { label: "Contacted", chip: "bg-brand/15 text-accent border border-brand/30" },
  CLOSED: { label: "Closed", chip: "bg-ink/8 text-ink/45 border border-line" },
};

const MEAL_LABELS: Record<HotelMeal, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

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

function roomsSummary(rooms: string[]): string {
  const counts = new Map<string, number>();
  for (const r of rooms) counts.set(r, (counts.get(r) ?? 0) + 1);
  return [...counts.entries()].map(([type, n]) => `${n}× ${type}`).join(", ");
}

export default function HotelBookingsManager() {
  const { items, loading, error, reload, remove } = useResource<HotelBookingRequestDTO>("/api/admin/hotel-bookings");
  const [filter, setFilter] = useState<"ALL" | HotelBookingStatus>("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { PENDING: 0, CONTACTED: 0, CLOSED: 0 };
    for (const r of items) c[r.status]++;
    return c;
  }, [items]);

  const visible = filter === "ALL" ? items : items.filter((r) => r.status === filter);

  async function setStatus(r: HotelBookingRequestDTO, status: HotelBookingStatus) {
    setBusyId(r.id);
    const res = await fetch(`/api/admin/hotel-bookings/${r.id}`, {
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

  async function onDelete(r: HotelBookingRequestDTO) {
    if (!confirm(`Delete the hotel request from "${r.fullName}"?`)) return;
    setBusyId(r.id);
    const res = await remove(r.id);
    setBusyId(null);
    if (!res.ok) alert(res.error);
  }

  const FILTERS: { key: "ALL" | HotelBookingStatus; label: string }[] = [
    { key: "ALL", label: `All (${items.length})` },
    { key: "PENDING", label: `Pending (${counts.PENDING})` },
    { key: "CONTACTED", label: `Contacted (${counts.CONTACTED})` },
    { key: "CLOSED", label: `Closed (${counts.CLOSED})` },
  ];

  return (
    <div>
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-ink">Hotel Bookings</h1>
          {counts.PENDING > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              {counts.PENDING} awaiting contact
            </span>
          )}
        </div>
        <p className="text-ink/45 text-sm mt-1">
          Hotel-booking requests from the website. Reach out over WhatsApp to confirm details and pricing.
        </p>
      </header>

      <ErrorText>{error}</ErrorText>

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
        <button onClick={() => reload()} className="text-xs font-medium px-3 py-2 rounded-lg border border-line text-ink/55 hover:text-ink hover:bg-ink/5 ms-auto">
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-ink/40 text-sm">No hotel requests{filter !== "ALL" ? " match this filter" : " yet"}.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => {
            const meta = STATUS_META[r.status];
            const busy = busyId === r.id;
            return (
              <div
                key={r.id}
                className={`rounded-2xl border bg-card p-4 sm:p-5 ${
                  r.status === "PENDING" ? "border-amber-500/40" : "border-line"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-ink font-semibold">{r.fullName}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${meta.chip}`}>{meta.label}</span>
                      <span className="text-ink/35 text-[11px]">{timeAgo(r.createdAt)}</span>
                    </div>
                    <div className="text-ink/60 text-sm mt-1">🏨 {r.hotelNameEn || r.hotelNameAr}</div>
                    <div className="text-ink/50 text-xs mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>🛏️ {roomsSummary(r.rooms)} ({r.rooms.length} {r.rooms.length === 1 ? "room" : "rooms"})</span>
                      {r.checkIn && (
                        <span>
                          📅 {new Date(r.checkIn).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          {r.nights != null && ` · ${r.nights} ${r.nights === 1 ? "night" : "nights"}`}
                        </span>
                      )}
                      {r.meals.length > 0 && (
                        <span>🍽️ {r.meals.map((m) => MEAL_LABELS[m]).join(", ")}</span>
                      )}
                      <a href={`tel:${r.phone}`} className="hover:text-ink">📞 {r.phone}</a>
                      <a
                        href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex gap-2">
                      {r.status !== "CONTACTED" && (
                        <Button onClick={() => setStatus(r, "CONTACTED")} disabled={busy} className="!py-1.5 !px-3 text-xs">
                          Contacted
                        </Button>
                      )}
                      {r.status !== "CLOSED" && (
                        <Button variant="ghost" onClick={() => setStatus(r, "CLOSED")} disabled={busy} className="!py-1.5 !px-3 text-xs">
                          Close
                        </Button>
                      )}
                      {r.status !== "PENDING" && (
                        <Button variant="ghost" onClick={() => setStatus(r, "PENDING")} disabled={busy} className="!py-1.5 !px-3 text-xs">
                          Reopen
                        </Button>
                      )}
                    </div>
                    <button
                      onClick={() => onDelete(r)}
                      disabled={busy}
                      className="text-red-600/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/25 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
