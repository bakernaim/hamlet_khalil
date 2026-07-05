import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, optionalStr, int, optionalInt, bool, optionalDate } from "@/lib/api";

const STATUSES = ["OPEN", "ALMOST_FULL", "DEPARTED", "CLOSED"];
const FREQUENCIES = ["ONCE", "WEEKLY", "BIWEEKLY", "MONTHLY"];

export async function GET() {
  const rows = await prisma.currentTrip.findMany({
    orderBy: [{ sortOrder: "asc" }, { departureDate: "asc" }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  if (!str(body.titleEn) && !str(body.titleAr)) return badRequest("A title is required");
  const departureDate = optionalDate(body.departureDate);
  if (!departureDate) return badRequest("A valid departure date is required");

  const status = STATUSES.includes(str(body.status)) ? str(body.status) : "OPEN";
  const frequency = FREQUENCIES.includes(str(body.frequency)) ? str(body.frequency) : "ONCE";

  const created = await prisma.currentTrip.create({
    data: {
      titleAr: str(body.titleAr),
      titleEn: str(body.titleEn),
      destinationAr: str(body.destinationAr),
      destinationEn: str(body.destinationEn),
      departureDate,
      returnDate: optionalDate(body.returnDate),
      frequency,
      recurEndDate: frequency === "ONCE" ? null : optionalDate(body.recurEndDate),
      price: int(body.price),
      seatsLeft: optionalInt(body.seatsLeft),
      status,
      image: optionalStr(body.image),
      packageType: optionalStr(body.packageType),
      packageSlug: optionalStr(body.packageSlug),
      sortOrder: int(body.sortOrder),
      published: bool(body.published),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
