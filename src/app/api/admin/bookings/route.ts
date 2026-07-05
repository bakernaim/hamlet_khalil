import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseList } from "@/lib/serialize";
import type { BookingDTO, BookingStatus } from "@/lib/types";

// Newest first so the admin sees recent / unconfirmed requests at the top.
export async function GET() {
  const rows = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
  const bookings: BookingDTO[] = rows.map((b) => ({
    id: b.id,
    tripId: b.tripId,
    tripTitleAr: b.tripTitleAr,
    tripTitleEn: b.tripTitleEn,
    departureDate: b.departureDate.toISOString(),
    fullName: b.fullName,
    phone: b.phone,
    partySize: b.partySize,
    passports: parseList(b.passports),
    notes: b.notes,
    status: b.status as BookingStatus,
    createdAt: b.createdAt.toISOString(),
  }));
  return NextResponse.json(bookings);
}
