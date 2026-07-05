import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, optionalStr, int, bool } from "@/lib/api";
import { removeUpload } from "@/lib/uploads";

type Ctx = { params: Promise<{ id: string }> };

// The uploaded file itself is immutable — edits only touch captions, order and
// visibility. Replacing the media means deleting the item and adding a new one.
export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.galleryItem.findUnique({ where: { id } });
  if (!existing) return notFound();

  const updated = await prisma.galleryItem.update({
    where: { id },
    data: {
      captionAr: optionalStr(body.captionAr),
      captionEn: optionalStr(body.captionEn),
      sortOrder: int(body.sortOrder, existing.sortOrder),
      published: bool(body.published, existing.published),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.galleryItem.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.galleryItem.delete({ where: { id } });
  await removeUpload(existing.src);
  return NextResponse.json({ ok: true });
}
