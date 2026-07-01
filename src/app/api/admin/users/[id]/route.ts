import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getSession } from "@/lib/session";
import { badRequest, notFound, str } from "@/lib/api";

const ROLES = ["admin", "editor"];

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return notFound();

  const role = ROLES.includes(str(body.role)) ? str(body.role) : existing.role;

  // Don't allow demoting the last remaining admin.
  if (existing.role === "admin" && role !== "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) return badRequest("Cannot demote the last remaining admin");
  }

  const data: { name: string; role: string; passwordHash?: string } = {
    name: str(body.name) || existing.name,
    role,
  };

  const password = str(body.password);
  if (password) {
    if (password.length < 6) return badRequest("Password must be at least 6 characters");
    data.passwordHash = await hashPassword(password);
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, username: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return notFound();

  const session = await getSession();
  if (session?.sub === id) return badRequest("You cannot delete your own account");

  if (existing.role === "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) return badRequest("Cannot delete the last remaining admin");
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
