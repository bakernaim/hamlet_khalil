import { NextResponse } from "next/server";
import { badRequest } from "@/lib/api";
import { saveUpload, uploadProblem, isVideoUpload } from "@/lib/uploads";

// Session-guarded by proxy.ts like the rest of /api/admin/**.
// Image-only by default; the gallery sends video=1 to also allow MP4/WebM.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return badRequest("Expected multipart form data");

  const file = form.get("file");
  const allowVideo = form.get("video") === "1";
  const problem = uploadProblem(file, allowVideo);
  if (problem) return badRequest(problem);

  const path = await saveUpload(file as File);
  return NextResponse.json(
    { path, type: isVideoUpload(file as File) ? "video" : "image" },
    { status: 201 }
  );
}
