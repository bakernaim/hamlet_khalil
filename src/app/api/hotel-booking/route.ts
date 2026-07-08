import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str } from "@/lib/api";
import { stringifyList } from "@/lib/serialize";
import { HOTEL_ROOM_TYPES, type HotelRoomType } from "@/lib/types";

const MAX_ROOMS = 20;

// PUBLIC endpoint — creates a hotel-booking request from the site. Separate
// from trip Booking: no departure date, passports, or payment step — just
// enough for staff to follow up over WhatsApp.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid request");

  const hotel = await prisma.hotel.findUnique({ where: { id: str(body.hotelId) } });
  if (!hotel || !hotel.published) return badRequest("This hotel is no longer available");

  const fullName = str(body.fullName);
  const phone = str(body.phone);
  if (!fullName) return badRequest("Your name is required");
  if (!phone) return badRequest("A phone number is required");

  const rooms = Array.isArray(body.rooms) ? body.rooms.map((r: unknown) => str(r).toUpperCase()) : [];
  if (rooms.length < 1 || rooms.length > MAX_ROOMS) {
    return badRequest(`Number of rooms must be between 1 and ${MAX_ROOMS}`);
  }
  if (!rooms.every((r: string) => HOTEL_ROOM_TYPES.includes(r as HotelRoomType))) {
    return badRequest("Please choose a valid room type for every room");
  }

  const request = await prisma.hotelBookingRequest.create({
    data: {
      hotelId: hotel.id,
      hotelNameAr: hotel.nameAr,
      hotelNameEn: hotel.nameEn,
      fullName,
      phone,
      rooms: stringifyList(rooms),
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true, id: request.id }, { status: 201 });
}
