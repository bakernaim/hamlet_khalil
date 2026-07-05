import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, optionalStr, int } from "@/lib/api";
import { stringifyList } from "@/lib/serialize";
import { isBookableDeparture } from "@/lib/recurrence";
import { passportExists } from "@/lib/uploads";
import { ROOM_TYPES, type RoomType } from "@/lib/types";

const MAX_PARTY = 30;

// PUBLIC endpoint — creates a booking request from the site. Starts PENDING;
// an admin reviews it (passports, payment) before confirming.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid request");

  const trip = await prisma.currentTrip.findUnique({ where: { id: str(body.tripId) } });
  if (!trip || !trip.published) return badRequest("This trip is no longer available");

  const departureISO = str(body.departureDate);
  if (!departureISO || !isBookableDeparture(departureISO, trip.departureDate, trip.frequency, trip.recurEndDate)) {
    return badRequest("Please choose an available departure date");
  }

  const fullName = str(body.fullName);
  const phone = str(body.phone);
  if (!fullName) return badRequest("Your name is required");
  if (!phone) return badRequest("A phone number is required");

  const partySize = int(body.partySize);
  if (partySize < 1 || partySize > MAX_PARTY) {
    return badRequest(`Number of travelers must be between 1 and ${MAX_PARTY}`);
  }

  const roomType = str(body.roomType).toUpperCase();
  if (!ROOM_TYPES.includes(roomType as RoomType)) {
    return badRequest("Please choose a room type");
  }

  const passports = Array.isArray(body.passports) ? body.passports.map((p: unknown) => str(p)) : [];
  if (passports.length !== partySize) {
    return badRequest("Please upload one passport image for each traveler");
  }
  for (const token of passports) {
    if (!(await passportExists(token))) {
      return badRequest("A passport upload was missing — please re-upload and try again");
    }
  }

  const booking = await prisma.booking.create({
    data: {
      tripId: trip.id,
      tripTitleAr: trip.titleAr,
      tripTitleEn: trip.titleEn,
      departureDate: new Date(departureISO),
      fullName,
      phone,
      partySize,
      roomType,
      passports: stringifyList(passports),
      notes: optionalStr(body.notes),
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
}
