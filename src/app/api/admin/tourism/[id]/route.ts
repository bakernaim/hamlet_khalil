import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, str, int, bool } from "@/lib/api";
import { sanitizeRichText } from "@/lib/sanitize";
import { removeUpload } from "@/lib/uploads";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const row = await prisma.tourismPackage.findUnique({ where: { id } });
  if (!row) return notFound();
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.tourismPackage.findUnique({ where: { id } });
  if (!existing) return notFound();

  const slug = str(body.slug, existing.slug);
  if (slug !== existing.slug) {
    const clash = await prisma.tourismPackage.findUnique({ where: { slug } });
    if (clash) return badRequest("A package with this slug already exists");
  }

  const image = str(body.image, existing.image);
  const updated = await prisma.tourismPackage.update({
    where: { id },
    data: {
      slug,
      flag: str(body.flag, existing.flag),
      nameAr: str(body.nameAr),
      nameEn: str(body.nameEn),
      durationAr: str(body.durationAr),
      durationEn: str(body.durationEn),
      descAr: str(body.descAr),
      descEn: str(body.descEn),
      infoAr: sanitizeRichText(str(body.infoAr)),
      infoEn: sanitizeRichText(str(body.infoEn)),
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
  const existing = await prisma.tourismPackage.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.tourismPackage.delete({ where: { id } });
  await removeUpload(existing.image);
  return NextResponse.json({ ok: true });
}
