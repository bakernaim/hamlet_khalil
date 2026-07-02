import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Admin-uploaded images live in public/uploads (gitignored). Seed images under
// /shrines are never touched by the cleanup helpers here.

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");
const PUBLIC_PREFIX = "/uploads/";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

// Returns an error message for an invalid upload, or null if it's acceptable.
export function uploadProblem(file: unknown): string | null {
  if (!(file instanceof File) || file.size === 0) return "No file provided";
  if (!EXT_BY_MIME[file.type]) return "Unsupported image type — use JPEG, PNG, WebP, GIF or AVIF";
  if (file.size > MAX_UPLOAD_BYTES) return "Image is too large (max 5 MB)";
  return null;
}

// Writes the file under a unique name and returns its public path (/uploads/…).
export async function saveUpload(file: File): Promise<string> {
  const ext = EXT_BY_MIME[file.type];
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));
  return PUBLIC_PREFIX + name;
}

// Deletes a previously uploaded file. No-op for anything outside /uploads/
// (seed images, external URLs, empty values) and for already-missing files.
export async function removeUpload(imagePath: string | null | undefined): Promise<void> {
  if (!imagePath || !imagePath.startsWith(PUBLIC_PREFIX)) return;
  const resolved = path.resolve(PUBLIC_DIR, "." + imagePath);
  if (!resolved.startsWith(UPLOADS_DIR + path.sep)) return;
  await unlink(resolved).catch(() => undefined);
}
