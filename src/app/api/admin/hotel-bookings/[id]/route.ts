import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, str } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES = ["PENDING", "CONTACTED", "CLOSED"];

// Update a hotel-booking request's status (contacted / closed / reopen).
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid request");

  const existing = await prisma.hotelBookingRequest.findUnique({ where: { id } });
  if (!existing) return notFound();

  const status = str(body.status);
  if (!STATUSES.includes(status)) return badRequest("Invalid status");

  const updated = await prisma.hotelBookingRequest.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.hotelBookingRequest.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.hotelBookingRequest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
