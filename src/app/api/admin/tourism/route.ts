import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, int, bool } from "@/lib/api";
import { sanitizeRichText } from "@/lib/sanitize";
import { stringifyList } from "@/lib/serialize";

export async function GET() {
  const rows = await prisma.tourismPackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const slug = str(body.slug);
  if (!slug) return badRequest("Slug is required");
  if (!str(body.nameEn) && !str(body.nameAr)) return badRequest("A name is required");

  const existing = await prisma.tourismPackage.findUnique({ where: { slug } });
  if (existing) return badRequest("A package with this slug already exists");

  const created = await prisma.tourismPackage.create({
    data: {
      slug,
      flag: str(body.flag, "✈️"),
      nameAr: str(body.nameAr),
      nameEn: str(body.nameEn),
      durationAr: str(body.durationAr),
      durationEn: str(body.durationEn),
      descAr: str(body.descAr),
      descEn: str(body.descEn),
      infoAr: sanitizeRichText(str(body.infoAr)),
      infoEn: sanitizeRichText(str(body.infoEn)),
      image: str(body.image, "/shrines/turkey-istanbul.jpg"),
      images: stringifyList(body.images),
      sortOrder: int(body.sortOrder),
      published: bool(body.published),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
