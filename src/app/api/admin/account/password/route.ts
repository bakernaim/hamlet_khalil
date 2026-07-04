import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getSession } from "@/lib/session";
import { badRequest, str } from "@/lib/api";

// Change the logged-in user's own password (requires the current one).
export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const currentPassword = str(body.currentPassword);
  const newPassword = str(body.newPassword);
  if (!currentPassword) return badRequest("Current password is required");
  if (newPassword.length < 6) return badRequest("New password must be at least 6 characters");

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ok = await verifyPassword(currentPassword, user.passwordHash);
  if (!ok) return badRequest("Current password is incorrect");

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });
  return NextResponse.json({ ok: true });
}
