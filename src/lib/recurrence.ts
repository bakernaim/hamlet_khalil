// Departure-date maths for current trips. A trip is either a one-off (ONCE) or
// repeats on a fixed cadence from its first departure up to an end date.

import type { TripFrequency } from "@/lib/types";

export const FREQUENCIES: TripFrequency[] = ["ONCE", "WEEKLY", "BIWEEKLY", "MONTHLY"];

export const FREQUENCY_LABEL: Record<TripFrequency, { ar: string; en: string }> = {
  ONCE: { ar: "مرة واحدة", en: "One-time" },
  WEEKLY: { ar: "أسبوعياً", en: "Weekly" },
  BIWEEKLY: { ar: "كل أسبوعين", en: "Every 2 weeks" },
  MONTHLY: { ar: "شهرياً", en: "Monthly" },
};

// Safety cap so a repeating trip with no end date can't generate forever.
const MAX_OCCURRENCES = 40;
const DEFAULT_HORIZON_MONTHS = 6;

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function advance(d: Date, frequency: TripFrequency): Date {
  const c = new Date(d);
  if (frequency === "WEEKLY") c.setDate(c.getDate() + 7);
  else if (frequency === "BIWEEKLY") c.setDate(c.getDate() + 14);
  else if (frequency === "MONTHLY") c.setMonth(c.getMonth() + 1);
  return c;
}

/**
 * Upcoming bookable departures for a trip, as Date objects (time preserved from
 * `start`). Past dates are excluded so a booking can never target a departure
 * that has already left.
 */
export function computeDepartures(
  start: Date,
  frequency: string,
  recurEnd: Date | null,
  from: Date = new Date()
): Date[] {
  const today = startOfDay(from);
  const freq = (FREQUENCIES as string[]).includes(frequency)
    ? (frequency as TripFrequency)
    : "ONCE";

  if (freq === "ONCE") {
    return startOfDay(start) >= today ? [new Date(start)] : [];
  }

  const horizon = new Date(start);
  horizon.setMonth(horizon.getMonth() + DEFAULT_HORIZON_MONTHS);
  const stopAt = recurEnd ?? horizon;

  const out: Date[] = [];
  let cursor = new Date(start);
  while (startOfDay(cursor) <= startOfDay(stopAt) && out.length < MAX_OCCURRENCES) {
    if (startOfDay(cursor) >= today) out.push(new Date(cursor));
    cursor = advance(cursor, freq);
  }
  return out;
}

// True if `iso` is one of the trip's currently-bookable departures.
export function isBookableDeparture(
  iso: string,
  start: Date,
  frequency: string,
  recurEnd: Date | null
): boolean {
  const target = startOfDay(new Date(iso)).getTime();
  return computeDepartures(start, frequency, recurEnd).some(
    (d) => startOfDay(d).getTime() === target
  );
}
