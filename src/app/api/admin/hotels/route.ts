import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, optionalStr, int, optionalInt, bool } from "@/lib/api";
import { stringifyList } from "@/lib/serialize";

export async function GET() {
  const rows = await prisma.hotel.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  if (!str(body.nameEn) && !str(body.nameAr)) return badRequest("A hotel name is required");
  if (!str(body.cityEn) && !str(body.cityAr)) return badRequest("A city is required");
  if (!str(body.countryEn) && !str(body.countryAr)) return badRequest("A country is required");

  const created = await prisma.hotel.create({
    data: {
      countryAr: str(body.countryAr),
      countryEn: str(body.countryEn),
      cityAr: str(body.cityAr),
      cityEn: str(body.cityEn),
      nameAr: str(body.nameAr),
      nameEn: str(body.nameEn),
      addressAr: optionalStr(body.addressAr),
      addressEn: optionalStr(body.addressEn),
      image: optionalStr(body.image),
      roomTypesAr: stringifyList(body.roomTypesAr),
      roomTypesEn: stringifyList(body.roomTypesEn),
      images: stringifyList(body.images),
      priceStart: optionalInt(body.priceStart),
      mealBreakfast: bool(body.mealBreakfast, false),
      mealLunch: bool(body.mealLunch, false),
      mealDinner: bool(body.mealDinner, false),
      website: optionalStr(body.website),
      sortOrder: int(body.sortOrder),
      published: bool(body.published),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
