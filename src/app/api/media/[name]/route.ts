import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { Readable } from "stream";
import { notFound } from "@/lib/api";
import { statMedia } from "@/lib/uploads";

type Ctx = { params: Promise<{ name: string }> };

// Serves admin-uploaded media from private_uploads/images. Unguarded on
// purpose — these are public marketing files (banners, package/trip photos,
// gallery clips) — but streamed through here so nothing sits in public/ as a
// raw static file. Supports Range requests so gallery videos can seek.
export async function GET(req: Request, { params }: Ctx) {
  const { name } = await params;
  const media = await statMedia(name);
  if (!media) return notFound("File not found");

  const baseHeaders = {
    "Content-Type": media.contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };

  const range = req.headers.get("range");
  const match = range?.match(/^bytes=(\d*)-(\d*)$/);
  if (match && (match[1] || match[2])) {
    // "bytes=a-b", "bytes=a-" (from a to end) or "bytes=-n" (last n bytes).
    const start = match[1] ? parseInt(match[1], 10) : Math.max(0, media.size - parseInt(match[2], 10));
    const end = match[1] && match[2] ? Math.min(parseInt(match[2], 10), media.size - 1) : media.size - 1;
    if (start >= media.size || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${media.size}` },
      });
    }
    const stream = Readable.toWeb(createReadStream(media.absPath, { start, end })) as ReadableStream;
    return new NextResponse(stream, {
      status: 206,
      headers: {
        ...baseHeaders,
        "Content-Range": `bytes ${start}-${end}/${media.size}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  const stream = Readable.toWeb(createReadStream(media.absPath)) as ReadableStream;
  return new NextResponse(stream, {
    headers: { ...baseHeaders, "Content-Length": String(media.size) },
  });
}
