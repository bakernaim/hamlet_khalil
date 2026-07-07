import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, int, bool } from "@/lib/api";

export async function GET() {
  const rows = await prisma.heroImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const src = str(body.src);
  if (!src.startsWith("/api/media/")) return badRequest("Please upload a photo first");

  const created = await prisma.heroImage.create({
    data: {
      src,
      sortOrder: int(body.sortOrder),
      published: bool(body.published),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
