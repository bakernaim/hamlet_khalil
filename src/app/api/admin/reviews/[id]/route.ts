import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, bool } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

// Moderation: only the approved flag is editable — review content belongs to
// the visitor who wrote it.
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return notFound();

  const updated = await prisma.review.update({
    where: { id },
    data: { approved: bool(body.approved, existing.approved) },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
