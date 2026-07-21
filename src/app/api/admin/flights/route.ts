import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, optionalStr, int, bool } from "@/lib/api";

export async function GET() {
  const rows = await prisma.flight.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  if (!str(body.fromEn) && !str(body.fromAr)) return badRequest("A departure city is required");
  if (!str(body.toEn) && !str(body.toAr)) return badRequest("A destination city is required");
  if (!str(body.airlineEn) && !str(body.airlineAr)) return badRequest("An airline is required");

  const created = await prisma.flight.create({
    data: {
      fromAr: str(body.fromAr),
      fromEn: str(body.fromEn),
      toAr: str(body.toAr),
      toEn: str(body.toEn),
      airlineAr: str(body.airlineAr),
      airlineEn: str(body.airlineEn),
      mealIncluded: bool(body.mealIncluded, false),
      price: int(body.price),
      image: optionalStr(body.image),
      sortOrder: int(body.sortOrder),
      published: bool(body.published),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
