"use client";

import { useState } from "react";
import { Field, Input, Toggle } from "@/components/admin/ui";
import {
  parseWorkingSchedule,
  stringifyWorkingSchedule,
  parseWorkingExceptions,
  stringifyWorkingExceptions,
  formatScheduleLines,
} from "@/lib/workingHours";
import type { SiteSettings, WorkingDaySchedule, WorkingHoursException, WorkingHoursRange } from "@/lib/types";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function TimeRangesEditor({
  ranges,
  onChange,
}: {
  ranges: WorkingHoursRange[];
  onChange: (ranges: WorkingHoursRange[]) => void;
}) {
  return (
    <div className="space-y-1.5">
      {ranges.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            type="time"
            dir="ltr"
            value={r.start}
            onChange={(e) => onChange(ranges.map((rr, ri) => (ri === i ? { ...rr, start: e.target.value } : rr)))}
            className="w-32"
          />
          <span className="text-ink/30 text-xs">to</span>
          <Input
            type="time"
            dir="ltr"
            value={r.end}
            onChange={(e) => onChange(ranges.map((rr, ri) => (ri === i ? { ...rr, end: e.target.value } : rr)))}
            className="w-32"
          />
          {ranges.length > 1 && (
            <button
              type="button"
              onClick={() => onChange(ranges.filter((_, ri) => ri !== i))}
              className="text-red-500 text-xs hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      {ranges.length < 2 && (
        <button
          type="button"
          onClick={() => onChange([...ranges, { start: "13:00", end: "18:00" }])}
          className="text-xs text-accent hover:underline"
        >
          + Add break
        </button>
      )}
    </div>
  );
}

function formatDateLabel(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function WorkingHoursCard({
  form,
  set,
}: {
  form: SiteSettings;
  set: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}) {
  const schedule = parseWorkingSchedule(form.workingSchedule);
  const exceptions = parseWorkingExceptions(form.workingExceptions);

  const [newException, setNewException] = useState<{
    date: string;
    closed: boolean;
    label: string;
    ranges: WorkingHoursRange[];
  }>({ date: "", closed: true, label: "", ranges: [{ start: "09:00", end: "18:00" }] });

  const updateDay = (i: number, next: WorkingDaySchedule) => {
    const nextSchedule = [...schedule];
    nextSchedule[i] = next;
    set("workingSchedule", stringifyWorkingSchedule(nextSchedule));
  };

  const addException = () => {
    if (!newException.date) return;
    const entry: WorkingHoursException = {
      date: newException.date,
      closed: newException.closed,
      ranges: newException.closed ? [] : newException.ranges,
      label: newException.label.trim() || undefined,
    };
    const next = [...exceptions.filter((e) => e.date !== entry.date), entry].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    set("workingExceptions", stringifyWorkingExceptions(next));
    setNewException({ date: "", closed: true, label: "", ranges: [{ start: "09:00", end: "18:00" }] });
  };

  const removeException = (date: string) => {
    set("workingExceptions", stringifyWorkingExceptions(exceptions.filter((e) => e.date !== date)));
  };

  return (
    <section className="rounded-2xl bg-card border border-line p-5 space-y-5">
      <div>
        <h2 className="text-ink font-semibold text-sm flex items-center gap-2">
          <span>🕒</span> Working Hours
        </h2>
        <p className="text-ink/40 text-xs mt-1">
          Controls the hours shown on the site and the live Open/Closed status in the footer.
        </p>
      </div>

      {/* Weekly schedule */}
      <div>
        <h3 className="text-ink/70 text-xs font-semibold mb-1">Weekly schedule</h3>
        <p className="text-ink/35 text-[11px] mb-2.5">
          Turn each weekday on or off with its switch. Add a break to split a day (e.g. a prayer hour).
        </p>
        <div className="space-y-2">
          {schedule.map((day, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 rounded-lg border px-3 py-2.5 transition-colors ${
                day.closed ? "border-line bg-page-alt/50" : "border-brand/30"
              }`}
            >
              <div className="w-36 shrink-0 pt-0.5">
                <Toggle
                  checked={!day.closed}
                  onChange={(open) =>
                    updateDay(i, {
                      ...day,
                      closed: !open,
                      ranges: open && day.ranges.length === 0 ? [{ start: "09:00", end: "18:00" }] : day.ranges,
                    })
                  }
                  label={DAY_LABELS[i]}
                />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                {day.closed ? (
                  <span className="text-xs text-ink/35">Closed</span>
                ) : (
                  <TimeRangesEditor ranges={day.ranges} onChange={(ranges) => updateDay(i, { ...day, ranges })} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Live preview of the text the site will show */}
        <div className="mt-3 rounded-lg bg-page-alt/60 border border-line px-3 py-2.5">
          <div className="text-[11px] text-ink/40 mb-1">Shown on the site (generated automatically)</div>
          <div className="grid grid-cols-2 gap-3 text-xs text-ink/70">
            <div className="space-y-0.5">
              {formatScheduleLines(schedule, "en").map((line) => (
                <div key={line} dir="ltr">{line}</div>
              ))}
            </div>
            <div className="space-y-0.5 text-end">
              {formatScheduleLines(schedule, "ar").map((line) => (
                <div key={line} dir="rtl">{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Date-specific overrides */}
      <div>
        <h3 className="text-ink/70 text-xs font-semibold mb-1">Special dates</h3>
        <p className="text-ink/35 text-[11px] mb-2.5">
          Override the weekly schedule for a specific date — a holiday closure, or custom hours for one day.
        </p>

        {exceptions.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {exceptions.map((e) => (
              <li
                key={e.date}
                className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <span className="text-ink font-medium">{formatDateLabel(e.date)}</span>
                  <span className="text-ink/40 ms-2">
                    {e.closed
                      ? "Closed"
                      : e.ranges.map((r) => `${r.start}–${r.end}`).join(", ") || "Custom hours"}
                  </span>
                  {e.label && <span className="text-ink/30 ms-2 italic">({e.label})</span>}
                </div>
                <button
                  type="button"
                  onClick={() => removeException(e.date)}
                  className="text-red-500 hover:underline shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-lg border border-dashed border-line p-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <Input
                type="date"
                dir="ltr"
                value={newException.date}
                onChange={(e) => setNewException((n) => ({ ...n, date: e.target.value }))}
              />
            </Field>
            <Field label="Note (optional)">
              <Input
                placeholder="e.g. Eid holiday"
                value={newException.label}
                onChange={(e) => setNewException((n) => ({ ...n, label: e.target.value }))}
              />
            </Field>
          </div>
          <Toggle
            checked={newException.closed}
            onChange={(v) => setNewException((n) => ({ ...n, closed: v }))}
            label="Fully closed this date"
          />
          {!newException.closed && (
            <TimeRangesEditor
              ranges={newException.ranges}
              onChange={(ranges) => setNewException((n) => ({ ...n, ranges }))}
            />
          )}
          <button
            type="button"
            onClick={addException}
            disabled={!newException.date}
            className="text-xs font-medium text-accent hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Add date
          </button>
        </div>
      </div>
    </section>
  );
}
