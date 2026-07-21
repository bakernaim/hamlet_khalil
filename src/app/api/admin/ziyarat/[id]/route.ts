import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseList, stringifyList } from "@/lib/serialize";
import { badRequest, notFound, str, optionalStr, int, bool } from "@/lib/api";
import { sanitizeRichText } from "@/lib/sanitize";
import { removeUpload, removeUploads } from "@/lib/uploads";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const row = await prisma.ziyaratPackage.findUnique({ where: { id } });
  if (!row) return notFound();
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.ziyaratPackage.findUnique({ where: { id } });
  if (!existing) return notFound();

  const slug = str(body.slug, existing.slug);
  if (slug !== existing.slug) {
    const clash = await prisma.ziyaratPackage.findUnique({ where: { slug } });
    if (clash) return badRequest("A package with this slug already exists");
  }

  const image = str(body.image, existing.image);
  const updated = await prisma.ziyaratPackage.update({
    where: { id },
    data: {
      slug,
      flag: str(body.flag, existing.flag),
      nameAr: str(body.nameAr),
      nameEn: str(body.nameEn),
      durationAr: str(body.durationAr),
      durationEn: str(body.durationEn),
      badgeAr: optionalStr(body.badgeAr),
      badgeEn: optionalStr(body.badgeEn),
      highlightsAr: stringifyList(body.highlightsAr),
      highlightsEn: stringifyList(body.highlightsEn),
      infoAr: sanitizeRichText(str(body.infoAr)),
      infoEn: sanitizeRichText(str(body.infoEn)),
      image,
      images: stringifyList(body.images),
      color: str(body.color, existing.color),
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
  const existing = await prisma.ziyaratPackage.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.ziyaratPackage.delete({ where: { id } });
  await removeUpload(existing.image);
  await removeUploads(parseList(existing.images));
  return NextResponse.json({ ok: true });
}
