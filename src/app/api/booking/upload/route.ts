import { NextResponse } from "next/server";
import { badRequest } from "@/lib/api";
import { savePassport, uploadProblem } from "@/lib/uploads";

// PUBLIC endpoint — used by the site's booking form to upload a traveler's
// passport image before the booking is submitted. The file is stored privately
// and can only be viewed later through the session-guarded admin route.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return badRequest("Expected multipart form data");

  const file = form.get("file");
  const problem = uploadProblem(file);
  if (problem) return badRequest(problem);

  const token = await savePassport(file as File);
  return NextResponse.json({ token }, { status: 201 });
}
