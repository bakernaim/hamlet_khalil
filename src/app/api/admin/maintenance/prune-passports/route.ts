import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { badRequest, forbidden, int, bool } from "@/lib/api";
import { parseList } from "@/lib/serialize";
import { removePassport } from "@/lib/uploads";

// Admin-only maintenance: delete the private passport images attached to
// bookings older than `olderThanDays` to free server space. By default the
// booking records are kept (their `passports` are just cleared); when
// `deleteRecords` is true the whole booking rows are removed too.
export async function POST(req: Request) {
  const session = await getSession();
  if (session?.role !== "admin") return forbidden("Only admins can run cleanup");

  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const olderThanDays = int(body.olderThanDays);
  if (olderThanDays < 1) return badRequest("Please choose a number of days (1 or more)");
  const deleteRecords = bool(body.deleteRecords, false);

  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

  let files = 0;

  // Trip bookings.
  const trips = await prisma.booking.findMany({
    where: { createdAt: { lt: cutoff }, ...(deleteRecords ? {} : { NOT: { passports: "[]" } }) },
    select: { id: true, passports: true },
  });
  for (const b of trips) {
    for (const token of parseList(b.passports)) {
      await removePassport(token);
      files++;
    }
  }

  // Flight bookings.
  const flights = await prisma.flightBookingRequest.findMany({
    where: { createdAt: { lt: cutoff }, ...(deleteRecords ? {} : { NOT: { passports: "[]" } }) },
    select: { id: true, passports: true },
  });
  for (const r of flights) {
    for (const token of parseList(r.passports)) {
      await removePassport(token);
      files++;
    }
  }

  if (deleteRecords) {
    await prisma.booking.deleteMany({ where: { id: { in: trips.map((b) => b.id) } } });
    await prisma.flightBookingRequest.deleteMany({ where: { id: { in: flights.map((r) => r.id) } } });
  } else {
    await prisma.booking.updateMany({ where: { id: { in: trips.map((b) => b.id) } }, data: { passports: "[]" } });
    await prisma.flightBookingRequest.updateMany({
      where: { id: { in: flights.map((r) => r.id) } },
      data: { passports: "[]" },
    });
  }

  return NextResponse.json({
    ok: true,
    deleteRecords,
    files,
    tripBookings: trips.length,
    flightBookings: flights.length,
  });
}
