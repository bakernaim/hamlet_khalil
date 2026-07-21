import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, str, optionalStr, int, bool } from "@/lib/api";
import { removeUpload } from "@/lib/uploads";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.instagramPost.findUnique({ where: { id } });
  if (!existing) return notFound();

  const image = str(body.image, existing.image);
  const updated = await prisma.instagramPost.update({
    where: { id },
    data: {
      image,
      permalink: str(body.permalink),
      captionAr: optionalStr(body.captionAr),
      captionEn: optionalStr(body.captionEn),
      sortOrder: int(body.sortOrder, existing.sortOrder),
      published: bool(body.published, existing.published),
    },
  });
  if (image !== existing.image) await removeUpload(existing.image);
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.instagramPost.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.instagramPost.delete({ where: { id } });
  await removeUpload(existing.image);
  return NextResponse.json({ ok: true });
}
