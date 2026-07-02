import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, optionalStr, int, optionalInt, bool, optionalDate } from "@/lib/api";

const THEMES = ["green", "amber"];

export async function GET() {
  const rows = await prisma.banner.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  if (!str(body.titleEn) && !str(body.titleAr)) return badRequest("A title is required");

  const created = await prisma.banner.create({
    data: {
      titleAr: str(body.titleAr),
      titleEn: str(body.titleEn),
      badgeAr: optionalStr(body.badgeAr),
      badgeEn: optionalStr(body.badgeEn),
      textAr: str(body.textAr),
      textEn: str(body.textEn),
      image: optionalStr(body.image),
      theme: THEMES.includes(str(body.theme)) ? str(body.theme) : "green",
      targetDate: optionalDate(body.targetDate),
      priceFrom: optionalInt(body.priceFrom),
      noteAr: optionalStr(body.noteAr),
      noteEn: optionalStr(body.noteEn),
      ctaAr: optionalStr(body.ctaAr),
      ctaEn: optionalStr(body.ctaEn),
      sortOrder: int(body.sortOrder),
      published: bool(body.published),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
