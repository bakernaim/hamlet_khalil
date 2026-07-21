import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, str, optionalStr, int, optionalInt, bool } from "@/lib/api";
import { parseList, stringifyList } from "@/lib/serialize";
import { removeUpload, removeUploads } from "@/lib/uploads";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const row = await prisma.hotel.findUnique({ where: { id } });
  if (!row) return notFound();
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.hotel.findUnique({ where: { id } });
  if (!existing) return notFound();

  const image = optionalStr(body.image);
  const updated = await prisma.hotel.update({
    where: { id },
    data: {
      countryAr: str(body.countryAr),
      countryEn: str(body.countryEn),
      cityAr: str(body.cityAr),
      cityEn: str(body.cityEn),
      nameAr: str(body.nameAr),
      nameEn: str(body.nameEn),
      addressAr: optionalStr(body.addressAr),
      addressEn: optionalStr(body.addressEn),
      image,
      roomTypesAr: stringifyList(body.roomTypesAr),
      roomTypesEn: stringifyList(body.roomTypesEn),
      images: stringifyList(body.images),
      priceStart: optionalInt(body.priceStart),
      mealBreakfast: bool(body.mealBreakfast, false),
      mealLunch: bool(body.mealLunch, false),
      mealDinner: bool(body.mealDinner, false),
      website: optionalStr(body.website),
      sortOrder: int(body.sortOrder, existing.sortOrder),
      published: bool(body.published),
    },
  });
  if (image !== existing.image) await removeUpload(existing.image);
  const keptImages = new Set(parseList(updated.images));
  await removeUploads(parseList(existing.images).filter((p) => !keptImages.has(p)));
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.hotel.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.hotel.delete({ where: { id } });
  await removeUpload(existing.image);
  await removeUploads(parseList(existing.images));
  return NextResponse.json({ ok: true });
}
