import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, int, optionalDate } from "@/lib/api";
import { stringifyList } from "@/lib/serialize";
import { passportExists } from "@/lib/uploads";

const MAX_PASSENGERS = 30;

// PUBLIC endpoint — creates a flight-booking request from the site. Like the
// hotel request: no payment step, just enough to follow up over WhatsApp.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid request");

  const flight = await prisma.flight.findUnique({ where: { id: str(body.flightId) } });
  if (!flight || !flight.published) return badRequest("This flight is no longer available");

  const fullName = str(body.fullName);
  const phone = str(body.phone);
  if (!fullName) return badRequest("Your name is required");
  if (!phone) return badRequest("A phone number is required");

  const travelDate = optionalDate(body.travelDate);
  if (!travelDate) return badRequest("Please choose a travel date");

  const passengers = int(body.passengers, 1);
  if (passengers < 1 || passengers > MAX_PASSENGERS) {
    return badRequest(`Number of passengers must be between 1 and ${MAX_PASSENGERS}`);
  }

  // One passport image per passenger (uploaded first via /api/booking/upload).
  const passports = Array.isArray(body.passports) ? body.passports.map((p: unknown) => str(p)) : [];
  if (passports.length !== passengers) {
    return badRequest("Please upload one passport image for each passenger");
  }
  for (const token of passports) {
    if (!(await passportExists(token))) {
      return badRequest("A passport upload was missing — please re-upload and try again");
    }
  }

  const request = await prisma.flightBookingRequest.create({
    data: {
      flightId: flight.id,
      fromAr: flight.fromAr,
      fromEn: flight.fromEn,
      toAr: flight.toAr,
      toEn: flight.toEn,
      airlineAr: flight.airlineAr,
      airlineEn: flight.airlineEn,
      fullName,
      phone,
      travelDate,
      passengers,
      passports: stringifyList(passports),
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true, id: request.id }, { status: 201 });
}
