import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stringifyList } from "@/lib/serialize";
import { badRequest, str, optionalStr, int, bool } from "@/lib/api";

export async function GET() {
  const rows = await prisma.ziyaratPackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const slug = str(body.slug);
  const nameEn = str(body.nameEn);
  if (!slug) return badRequest("Slug is required");
  if (!nameEn && !str(body.nameAr)) return badRequest("A name is required");

  const existing = await prisma.ziyaratPackage.findUnique({ where: { slug } });
  if (existing) return badRequest("A package with this slug already exists");

  const created = await prisma.ziyaratPackage.create({
    data: {
      slug,
      flag: str(body.flag, "🕌"),
      nameAr: str(body.nameAr),
      nameEn,
      durationAr: str(body.durationAr),
      durationEn: str(body.durationEn),
      price: int(body.price),
      badgeAr: optionalStr(body.badgeAr),
      badgeEn: optionalStr(body.badgeEn),
      highlightsAr: stringifyList(body.highlightsAr),
      highlightsEn: stringifyList(body.highlightsEn),
      image: str(body.image, "/shrines/hussain-karbala.jpg"),
      color: str(body.color, "from-[#1a2444] to-[#0a0f2c]"),
      sortOrder: int(body.sortOrder),
      published: bool(body.published),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
