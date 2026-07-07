import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, int, bool } from "@/lib/api";
import { removeUpload } from "@/lib/uploads";

type Ctx = { params: Promise<{ id: string }> };

// The uploaded photo itself is immutable — edits only touch order and
// visibility. Replacing the photo means deleting the item and adding a new one.
export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.heroImage.findUnique({ where: { id } });
  if (!existing) return notFound();

  const updated = await prisma.heroImage.update({
    where: { id },
    data: {
      sortOrder: int(body.sortOrder, existing.sortOrder),
      published: bool(body.published, existing.published),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.heroImage.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.heroImage.delete({ where: { id } });
  await removeUpload(existing.src);
  return NextResponse.json({ ok: true });
}
