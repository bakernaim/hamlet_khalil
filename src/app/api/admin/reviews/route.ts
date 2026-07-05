import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AdminReviewDTO } from "@/lib/types";

// All reviews, newest first — pending ones surface at the top of the manager.
export async function GET() {
  const rows = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  const reviews: AdminReviewDTO[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    tripLabel: r.tripLabel,
    rating: r.rating,
    text: r.text,
    approved: r.approved,
    createdAt: r.createdAt.toISOString(),
  }));
  return NextResponse.json(reviews);
}
