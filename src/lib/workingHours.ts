// Per-day opening schedule, stored as JSON in the `workingSchedule` setting.
// Each day can have zero, one, or two time ranges (a second range covers a
// midday closure, e.g. a prayer break). Date-specific overrides (holidays,
// special hours) live separately in the `workingExceptions` setting and take
// priority over the weekly schedule.
import type { WorkingDaySchedule, WorkingHoursException, WorkingHoursRange } from "./types";

export const DEFAULT_WORKING_SCHEDULE: WorkingDaySchedule[] = [
  { day: 0, closed: true, ranges: [] }, // Sun
  { day: 1, closed: false, ranges: [{ start: "09:00", end: "18:00" }] }, // Mon
  { day: 2, closed: false, ranges: [{ start: "09:00", end: "18:00" }] }, // Tue
  { day: 3, closed: false, ranges: [{ start: "09:00", end: "18:00" }] }, // Wed
  {
    day: 4,
    closed: false,
    ranges: [
      { start: "09:00", end: "12:00" },
      { start: "13:00", end: "18:00" },
    ],
  }, // Thu, with a 1-hour prayer break
  { day: 5, closed: true, ranges: [] }, // Fri
  { day: 6, closed: false, ranges: [{ start: "09:00", end: "13:00" }] }, // Sat
];

export function parseWorkingSchedule(json: string | null | undefined): WorkingDaySchedule[] {
  if (!json) return DEFAULT_WORKING_SCHEDULE;
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return DEFAULT_WORKING_SCHEDULE;
    return Array.from({ length: 7 }, (_, day) => {
      const found = parsed.find((d) => d && d.day === day);
      if (!found) return { day, closed: true, ranges: [] };
      const ranges = Array.isArray(found.ranges)
        ? found.ranges
            .filter(
              (r: unknown): r is { start: string; end: string } =>
                !!r &&
                typeof (r as { start?: unknown }).start === "string" &&
                typeof (r as { end?: unknown }).end === "string"
            )
            .map((r: { start: string; end: string }) => ({ start: r.start, end: r.end }))
        : [];
      return { day, closed: !!found.closed || ranges.length === 0, ranges };
    });
  } catch {
    return DEFAULT_WORKING_SCHEDULE;
  }
}

export function stringifyWorkingSchedule(schedule: WorkingDaySchedule[]): string {
  return JSON.stringify(schedule);
}

export function parseWorkingExceptions(json: string | null | undefined): WorkingHoursException[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e): e is WorkingHoursException => !!e && typeof e.date === "string")
      .map((e) => ({
        date: e.date,
        closed: !!e.closed,
        ranges: Array.isArray(e.ranges)
          ? e.ranges
              .filter(
                (r: unknown): r is { start: string; end: string } =>
                  !!r &&
                  typeof (r as { start?: unknown }).start === "string" &&
                  typeof (r as { end?: unknown }).end === "string"
              )
              .map((r: { start: string; end: string }) => ({ start: r.start, end: r.end }))
          : [],
        label: typeof e.label === "string" ? e.label : undefined,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function stringifyWorkingExceptions(exceptions: WorkingHoursException[]): string {
  return JSON.stringify(exceptions);
}

// "YYYY-MM-DD" in local time, matching the value of a native <input type="date">.
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isWithinRanges(ranges: WorkingHoursRange[], minutesNow: number): boolean {
  return ranges.some((r) => {
    const [startH, startM] = r.start.split(":").map(Number);
    const [endH, endM] = r.end.split(":").map(Number);
    return minutesNow >= startH * 60 + startM && minutesNow < endH * 60 + endM;
  });
}

const DAY_NAMES = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
};

function formatTime(hhmm: string, locale: "en" | "ar"): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const d = new Date(2000, 0, 1, h, m);
  return d.toLocaleTimeString(locale === "ar" ? "ar-LB" : "en-US", {
    hour: "numeric",
    minute: m === 0 ? undefined : "2-digit",
  });
}

function rangesLabel(ranges: WorkingHoursRange[], locale: "en" | "ar"): string {
  const sep = locale === "ar" ? "، " : ", ";
  const dash = locale === "ar" ? " - " : " – ";
  return ranges.map((r) => `${formatTime(r.start, locale)}${dash}${formatTime(r.end, locale)}`).join(sep);
}

// Human-readable summary lines generated from the weekly schedule, e.g.
// ["Mon – Wed: 9 AM – 6 PM", "Thu: 9 AM – 12 PM, 1 PM – 6 PM", "Sat: 9 AM – 1 PM"].
// Consecutive open days with identical hours are grouped into one line.
export function formatScheduleLines(schedule: WorkingDaySchedule[], locale: "en" | "ar"): string[] {
  const names = DAY_NAMES[locale];
  const dash = locale === "ar" ? " - " : " – ";
  const lines: string[] = [];
  let i = 0;
  while (i < 7) {
    const day = schedule.find((d) => d.day === i);
    if (!day || day.closed || day.ranges.length === 0) {
      i++;
      continue;
    }
    const signature = JSON.stringify(day.ranges);
    let j = i;
    while (j + 1 < 7) {
      const next = schedule.find((d) => d.day === j + 1);
      if (!next || next.closed || JSON.stringify(next.ranges) !== signature) break;
      j++;
    }
    const dayLabel = i === j ? names[i] : `${names[i]}${dash}${names[j]}`;
    lines.push(`${dayLabel}: ${rangesLabel(day.ranges, locale)}`);
    i = j + 1;
  }
  return lines;
}

export function isOpenAt(
  schedule: WorkingDaySchedule[],
  date: Date,
  exceptions: WorkingHoursException[] = []
): boolean {
  const minutesNow = date.getHours() * 60 + date.getMinutes();
  const exception = exceptions.find((e) => e.date === dateKey(date));
  if (exception) {
    if (exception.closed) return false;
    return isWithinRanges(exception.ranges, minutesNow);
  }
  const day = schedule.find((d) => d.day === date.getDay());
  if (!day || day.closed) return false;
  return isWithinRanges(day.ranges, minutesNow);
}
