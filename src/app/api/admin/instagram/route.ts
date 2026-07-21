import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, optionalStr, int, bool } from "@/lib/api";

export async function GET() {
  const rows = await prisma.instagramPost.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const image = str(body.image);
  if (!image) return badRequest("Please upload a photo first");

  const created = await prisma.instagramPost.create({
    data: {
      image,
      permalink: str(body.permalink),
      captionAr: optionalStr(body.captionAr),
      captionEn: optionalStr(body.captionEn),
      sortOrder: int(body.sortOrder),
      published: bool(body.published),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
