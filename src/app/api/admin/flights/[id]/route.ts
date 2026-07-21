import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, str, optionalStr, int, bool } from "@/lib/api";
import { removeUpload } from "@/lib/uploads";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const row = await prisma.flight.findUnique({ where: { id } });
  if (!row) return notFound();
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.flight.findUnique({ where: { id } });
  if (!existing) return notFound();

  const image = optionalStr(body.image);
  const updated = await prisma.flight.update({
    where: { id },
    data: {
      fromAr: str(body.fromAr),
      fromEn: str(body.fromEn),
      toAr: str(body.toAr),
      toEn: str(body.toEn),
      airlineAr: str(body.airlineAr),
      airlineEn: str(body.airlineEn),
      mealIncluded: bool(body.mealIncluded, false),
      price: int(body.price, existing.price),
      image,
      sortOrder: int(body.sortOrder, existing.sortOrder),
      published: bool(body.published),
    },
  });
  if (image !== existing.image) await removeUpload(existing.image);
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.flight.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.flight.delete({ where: { id } });
  await removeUpload(existing.image);
  return NextResponse.json({ ok: true });
}
