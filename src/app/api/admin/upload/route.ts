import { NextResponse } from "next/server";
import { badRequest } from "@/lib/api";
import { saveUpload, uploadProblem } from "@/lib/uploads";

// Session-guarded by proxy.ts like the rest of /api/admin/**.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return badRequest("Expected multipart form data");

  const file = form.get("file");
  const problem = uploadProblem(file);
  if (problem) return badRequest(problem);

  const path = await saveUpload(file as File);
  return NextResponse.json({ path }, { status: 201 });
}
