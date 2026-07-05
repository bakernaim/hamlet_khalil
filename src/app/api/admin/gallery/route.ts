import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, optionalStr, int, bool } from "@/lib/api";

const TYPES = ["image", "video"];

export async function GET() {
  const rows = await prisma.galleryItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const src = str(body.src);
  if (!src.startsWith("/api/media/")) return badRequest("Please upload a photo or video first");
  const type = TYPES.includes(str(body.type)) ? str(body.type) : "image";

  const created = await prisma.galleryItem.create({
    data: {
      type,
      src,
      captionAr: optionalStr(body.captionAr),
      captionEn: optionalStr(body.captionEn),
      sortOrder: int(body.sortOrder),
      published: bool(body.published),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
