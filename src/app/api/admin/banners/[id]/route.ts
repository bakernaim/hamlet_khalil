import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, str, optionalStr, int, optionalInt, bool, optionalDate } from "@/lib/api";
import { removeUpload } from "@/lib/uploads";

const THEMES = ["green", "amber"];

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const row = await prisma.banner.findUnique({ where: { id } });
  if (!row) return notFound();
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) return notFound();

  const image = optionalStr(body.image);
  const updated = await prisma.banner.update({
    where: { id },
    data: {
      titleAr: str(body.titleAr),
      titleEn: str(body.titleEn),
      badgeAr: optionalStr(body.badgeAr),
      badgeEn: optionalStr(body.badgeEn),
      textAr: str(body.textAr),
      textEn: str(body.textEn),
      image,
      theme: THEMES.includes(str(body.theme)) ? str(body.theme) : existing.theme,
      targetDate: optionalDate(body.targetDate),
      priceFrom: optionalInt(body.priceFrom),
      noteAr: optionalStr(body.noteAr),
      noteEn: optionalStr(body.noteEn),
      ctaAr: optionalStr(body.ctaAr),
      ctaEn: optionalStr(body.ctaEn),
      sortOrder: int(body.sortOrder, existing.sortOrder),
      published: bool(body.published),
    },
  });
  if (image !== existing.image) await removeUpload(existing.image);
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.banner.delete({ where: { id } });
  await removeUpload(existing.image);
  return NextResponse.json({ ok: true });
}
