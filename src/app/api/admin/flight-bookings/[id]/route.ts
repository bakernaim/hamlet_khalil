import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, notFound, str } from "@/lib/api";
import { parseList } from "@/lib/serialize";
import { removePassport } from "@/lib/uploads";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES = ["PENDING", "CONTACTED", "CLOSED"];

// Update a flight-booking request's status (contacted / closed / reopen).
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid request");

  const existing = await prisma.flightBookingRequest.findUnique({ where: { id } });
  if (!existing) return notFound();

  const status = str(body.status);
  if (!STATUSES.includes(status)) return badRequest("Invalid status");

  const updated = await prisma.flightBookingRequest.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.flightBookingRequest.findUnique({ where: { id } });
  if (!existing) return notFound();
  await prisma.flightBookingRequest.delete({ where: { id } });
  // Clean up the private passport files this request owned.
  for (const token of parseList(existing.passports)) await removePassport(token);
  return NextResponse.json({ ok: true });
}
