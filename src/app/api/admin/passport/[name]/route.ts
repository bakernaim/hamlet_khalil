import { NextResponse } from "next/server";
import { notFound } from "@/lib/api";
import { readPassport } from "@/lib/uploads";

type Ctx = { params: Promise<{ name: string }> };

// Serves a private passport image. Session-guarded by proxy.ts (/api/admin/**),
// so only logged-in staff can view traveler documents.
export async function GET(_req: Request, { params }: Ctx) {
  const { name } = await params;
  const file = await readPassport(name);
  if (!file) return notFound("Passport not found");

  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "private, no-store",
    },
  });
}
