import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getSession } from "@/lib/session";
import { badRequest, forbidden, str } from "@/lib/api";

const ROLES = ["admin", "editor"];

export async function GET() {
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, username: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (session?.role !== "admin") return forbidden("Only admins can manage staff users");

  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const username = str(body.username).toLowerCase();
  const name = str(body.name) || username;
  const password = str(body.password);
  const role = ROLES.includes(str(body.role)) ? str(body.role) : "editor";

  if (!username) return badRequest("Username is required");
  if (password.length < 6) return badRequest("Password must be at least 6 characters");

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return badRequest("A user with this username already exists");

  const user = await prisma.user.create({
    data: { username, name, role, passwordHash: await hashPassword(password) },
    select: { id: true, username: true, name: true, role: true, createdAt: true },
  });
  return NextResponse.json(user, { status: 201 });
}
