import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, str, optionalStr, int } from "@/lib/api";

const MAX_NAME = 80;
const MAX_TRIP = 120;
const MAX_TEXT = 1200;

// PUBLIC endpoint — a visitor submits a review. It stays hidden (approved:
// false) until an admin approves it from the dashboard.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest("Invalid request");

  const name = str(body.name);
  const text = str(body.text);
  const rating = int(body.rating);

  if (!name) return badRequest("Your name is required");
  if (name.length > MAX_NAME) return badRequest("Name is too long");
  if (!text) return badRequest("Please write your review");
  if (text.length > MAX_TEXT) return badRequest("Review is too long");
  if (rating < 1 || rating > 5) return badRequest("Rating must be between 1 and 5 stars");

  const tripLabel = optionalStr(body.tripLabel);
  if (tripLabel && tripLabel.length > MAX_TRIP) return badRequest("Trip name is too long");

  const review = await prisma.review.create({
    data: { name, tripLabel, rating, text, approved: false },
  });

  return NextResponse.json({ ok: true, id: review.id }, { status: 201 });
}
