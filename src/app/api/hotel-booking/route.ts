import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, optionalDate, optionalInt } from "@/lib/api";
import { parseList, stringifyList } from "@/lib/serialize";
import { HOTEL_ROOM_TYPES, HOTEL_MEALS, type HotelMeal } from "@/lib/types";

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

  // Allowed room types = the hotel's own list, falling back to the generic enum
  // when the hotel hasn't defined any.
  const roomTypesEn = parseList(hotel.roomTypesEn);
  const roomTypesAr = parseList(hotel.roomTypesAr);
  const allowedRooms = new Set<string>();
  const typeCount = Math.max(roomTypesEn.length, roomTypesAr.length);
  for (let i = 0; i < typeCount; i++) {
    const v = roomTypesEn[i] || roomTypesAr[i];
    if (v) allowedRooms.add(v);
  }
  if (allowedRooms.size === 0) HOTEL_ROOM_TYPES.forEach((t) => allowedRooms.add(t));

  const rooms = Array.isArray(body.rooms) ? body.rooms.map((r: unknown) => str(r)) : [];
  if (rooms.length < 1 || rooms.length > MAX_ROOMS) {
    return badRequest(`Number of rooms must be between 1 and ${MAX_ROOMS}`);
  }
  if (!rooms.every((r: string) => allowedRooms.has(r))) {
    return badRequest("Please choose a valid room type for every room");
  }

  // Requested meals must be among the meals the hotel actually offers.
  const offeredMeals = new Set<HotelMeal>();
  if (hotel.mealBreakfast) offeredMeals.add("BREAKFAST");
  if (hotel.mealLunch) offeredMeals.add("LUNCH");
  if (hotel.mealDinner) offeredMeals.add("DINNER");
  const meals = Array.isArray(body.meals) ? body.meals.map((m: unknown) => str(m).toUpperCase()) : [];
  if (!meals.every((m: string) => HOTEL_MEALS.includes(m as HotelMeal) && offeredMeals.has(m as HotelMeal))) {
    return badRequest("This hotel does not offer one of the selected meals");
  }
  // De-duplicate and keep a stable order.
  const selectedMeals = HOTEL_MEALS.filter((m) => meals.includes(m));

  const checkIn = optionalDate(body.checkIn);
  const nights = optionalInt(body.nights);
  if (nights != null && (nights < 1 || nights > 365)) {
    return badRequest("Number of nights must be between 1 and 365");
  }

  const request = await prisma.hotelBookingRequest.create({
    data: {
      hotelId: hotel.id,
      hotelNameAr: hotel.nameAr,
      hotelNameEn: hotel.nameEn,
      fullName,
      phone,
      rooms: stringifyList(rooms),
      meals: stringifyList(selectedMeals),
      checkIn,
      nights,
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true, id: request.id }, { status: 201 });
}
