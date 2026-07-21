import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseList } from "@/lib/serialize";
import type { FlightBookingRequestDTO, FlightBookingStatus } from "@/lib/types";

// Newest first so the admin sees recent requests at the top.
export async function GET() {
  const rows = await prisma.flightBookingRequest.findMany({ orderBy: { createdAt: "desc" } });
  const requests: FlightBookingRequestDTO[] = rows.map((r) => ({
    id: r.id,
    flightId: r.flightId,
    fromAr: r.fromAr,
    fromEn: r.fromEn,
    toAr: r.toAr,
    toEn: r.toEn,
    airlineAr: r.airlineAr,
    airlineEn: r.airlineEn,
    fullName: r.fullName,
    phone: r.phone,
    travelDate: r.travelDate.toISOString(),
    passengers: r.passengers,
    passports: parseList(r.passports),
    status: r.status as FlightBookingStatus,
    createdAt: r.createdAt.toISOString(),
  }));
  return NextResponse.json(requests);
}
