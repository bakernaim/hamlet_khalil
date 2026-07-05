"use client";

import { useMemo, useState } from "react";
import { useResource } from "@/components/admin/useResource";
import { Button, ErrorText } from "@/components/admin/ui";
import type { AdminReviewDTO } from "@/lib/types";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function ReviewsManager() {
  const { items, loading, error, reload, remove } = useResource<AdminReviewDTO>("/api/admin/reviews");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED">("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      pending: items.filter((r) => !r.approved).length,
      approved: items.filter((r) => r.approved).length,
    }),
    [items]
  );

  const visible =
    filter === "ALL" ? items : items.filter((r) => (filter === "APPROVED" ? r.approved : !r.approved));

  async function setApproved(r: AdminReviewDTO, approved: boolean) {
    setBusyId(r.id);
    const res = await fetch(`/api/admin/reviews/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    setBusyId(null);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Update failed");
      return;
    }
    reload();
  }

  async function onDelete(r: AdminReviewDTO) {
    if (!confirm(`Delete the review from "${r.name}"?`)) return;
    setBusyId(r.id);
    const res = await remove(r.id);
    setBusyId(null);
    if (!res.ok) alert(res.error);
  }

  const FILTERS: { key: "ALL" | "PENDING" | "APPROVED"; label: string }[] = [
    { key: "ALL", label: `All (${items.length})` },
    { key: "PENDING", label: `Pending (${counts.pending})` },
    { key: "APPROVED", label: `Approved (${counts.approved})` },
  ];

  return (
    <div>
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-ink">Reviews</h1>
          {counts.pending > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              {counts.pending} awaiting approval
            </span>
          )}
        </div>
        <p className="text-ink/45 text-sm mt-1">
          Visitor reviews from the website. They appear on the site only after you approve them.
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
        <button
          onClick={() => reload()}
          className="text-xs font-medium px-3 py-1.5 rounded-full border border-line text-ink/55 hover:text-ink hover:bg-ink/5 ms-auto"
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-ink/40 text-sm">No reviews{filter !== "ALL" ? " in this filter" : " yet"}.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => {
            const busy = busyId === r.id;
            return (
              <div
                key={r.id}
                className={`rounded-2xl border bg-card p-4 sm:p-5 ${
                  r.approved ? "border-line" : "border-amber-500/40"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-ink font-semibold">{r.name}</span>
                      <span className="text-amber-500 dark:text-amber-400 text-sm">
                        {"★".repeat(r.rating)}
                        <span className="opacity-25">{"★".repeat(5 - r.rating)}</span>
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full border ${
                          r.approved
                            ? "bg-brand/15 text-accent border-brand/30"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {r.approved ? "Approved" : "Pending"}
                      </span>
                      <span className="text-ink/35 text-[11px]">{fmtDate(r.createdAt)}</span>
                    </div>
                    {r.tripLabel && <div className="text-accent/80 text-xs mt-1">{r.tripLabel}</div>}
                    <p className="text-ink/70 text-sm mt-2 leading-relaxed whitespace-pre-line">{r.text}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {r.approved ? (
                      <Button variant="ghost" onClick={() => setApproved(r, false)} disabled={busy} className="!py-1.5 !px-3 text-xs">
                        Hide
                      </Button>
                    ) : (
                      <Button onClick={() => setApproved(r, true)} disabled={busy} className="!py-1.5 !px-3 text-xs">
                        Approve
                      </Button>
                    )}
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
