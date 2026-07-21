"use client";

import { useState } from "react";
import { Field, Input, Button, Toggle, ErrorText, Modal } from "@/components/admin/ui";

type Result = {
  deleteRecords: boolean;
  files: number;
  tripBookings: number;
  flightBookings: number;
};

export default function BookingCleanupCard() {
  const [days, setDays] = useState("90");
  const [deleteRecords, setDeleteRecords] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function openConfirm() {
    const n = Number(days);
    if (!Number.isFinite(n) || n < 1) {
      setError("Enter a number of days (1 or more).");
      return;
    }
    setError("");
    setConfirmOpen(true);
  }

  async function run() {
    const n = Number(days);
    setConfirmOpen(false);
    setRunning(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/maintenance/prune-passports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ olderThanDays: n, deleteRecords }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Cleanup failed");
        return;
      }
      setResult(data as Result);
    } catch {
      setError("Network error");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="rounded-2xl bg-card border border-line p-5 space-y-4">
      <div>
        <h2 className="text-ink font-semibold text-sm">Storage cleanup</h2>
        <p className="text-ink/45 text-xs mt-1">
          Free up server space by removing the private passport images uploaded with old trip and flight bookings.
          Admin only. Hotel bookings have no images. This can&apos;t be undone.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <Field label="Delete images from bookings older than" hint="In days">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="max-w-[100px]"
            />
            <span className="text-ink/60 text-sm">days</span>
          </div>
        </Field>
        <Toggle
          checked={deleteRecords}
          onChange={setDeleteRecords}
          label="Also delete the booking records"
        />
      </div>

      <p className="text-ink/40 text-[11px]">
        {deleteRecords
          ? "The whole booking rows (and their images) will be removed from the database."
          : "The booking records are kept for your history — only the passport image files are deleted."}
      </p>

      <ErrorText>{error}</ErrorText>

      {result && (
        <div className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-ink">
          ✓ {result.deleteRecords ? "Deleted" : "Cleaned"} {result.tripBookings} trip booking
          {result.tripBookings === 1 ? "" : "s"} and {result.flightBookings} flight booking
          {result.flightBookings === 1 ? "" : "s"} · {result.files} image{result.files === 1 ? "" : "s"} removed.
        </div>
      )}

      <div>
        <Button type="button" variant="danger" onClick={openConfirm} disabled={running}>
          {running ? "Cleaning…" : "Run cleanup"}
        </Button>
      </div>

      <Modal open={confirmOpen} title="Confirm cleanup" onClose={() => setConfirmOpen(false)}>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-600 dark:text-red-300 text-2xl flex items-center justify-center">
            ⚠️
          </div>
          <p className="text-ink text-sm leading-relaxed">
            {deleteRecords ? (
              <>
                This will <strong>permanently delete all trip &amp; flight bookings older than {days} days</strong>,
                including their passport images.
              </>
            ) : (
              <>
                This will <strong>permanently delete the passport images</strong> of trip &amp; flight bookings older
                than {days} days. The booking records are kept.
              </>
            )}
          </p>
          <p className="text-ink/50 text-xs">This can&apos;t be undone.</p>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={run}>
              {deleteRecords ? "Delete bookings & images" : "Delete images"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
