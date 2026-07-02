import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, str, optionalStr, int, optionalInt, bool, optionalDate } from "@/lib/api";
import { removeUpload } from "@/lib/uploads";

const STATUSES = ["OPEN", "ALMOST_FULL", "DEPARTED", "CLOSED"];

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const row = await prisma.currentTrip.findUnique({ where: { id } });
  if (!row) return notFound();
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.currentTrip.findUnique({ where: { id } });
  if (!existing) return notFound();

  const departureDate = optionalDate(body.departureDate) ?? existing.departureDate;
  const status = STATUSES.includes(str(body.status)) ? str(body.status) : existing.status;
  const image = optionalStr(body.image);

  const updated = await prisma.currentTrip.update({
    where: { id },
    data: {
      titleAr: str(body.titleAr),
      titleEn: str(body.titleEn),
      destinationAr: str(body.destinationAr),
      destinationEn: str(body.destinationEn),
      departureDate,
      returnDate: optionalDate(body.returnDate),
      price: int(body.price, existing.price),
      seatsLeft: optionalInt(body.seatsLeft),
      status,
      image,
      packageType: optionalStr(body.packageType),
      packageSlug: optionalStr(body.packageSlug),
      sortOrder: int(body.sortOrder, existing.sortOrder),
      published: bool(body.published),
    },
  });
  if (image !== existing.image) await removeUpload(existing.image);
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.currentTrip.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.currentTrip.delete({ where: { id } });
  await removeUpload(existing.image);
  return NextResponse.json({ ok: true });
}
