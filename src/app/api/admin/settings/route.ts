import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildSettings, SETTING_KEYS } from "@/lib/settings";
import { badRequest, str } from "@/lib/api";

export async function GET() {
  const rows = await prisma.setting.findMany();
  return NextResponse.json(buildSettings(rows));
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Invalid JSON body");

  const updates = SETTING_KEYS.filter((key) => key in body).map((key) => {
    const value = str((body as Record<string, unknown>)[key]);
    return prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  });

  await prisma.$transaction(updates);

  const rows = await prisma.setting.findMany();
  return NextResponse.json(buildSettings(rows));
}
