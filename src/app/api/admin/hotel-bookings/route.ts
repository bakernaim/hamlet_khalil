import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseList } from "@/lib/serialize";
import type { HotelBookingRequestDTO, HotelBookingStatus, HotelMeal } from "@/lib/types";

// Newest first so the admin sees recent requests at the top.
export async function GET() {
  const rows = await prisma.hotelBookingRequest.findMany({ orderBy: { createdAt: "desc" } });
  const requests: HotelBookingRequestDTO[] = rows.map((r) => ({
    id: r.id,
    hotelId: r.hotelId,
    hotelNameAr: r.hotelNameAr,
    hotelNameEn: r.hotelNameEn,
    fullName: r.fullName,
    phone: r.phone,
    rooms: parseList(r.rooms),
    meals: parseList(r.meals) as HotelMeal[],
    checkIn: r.checkIn ? r.checkIn.toISOString() : null,
    nights: r.nights,
    status: r.status as HotelBookingStatus,
    createdAt: r.createdAt.toISOString(),
  }));
  return NextResponse.json(requests);
}
