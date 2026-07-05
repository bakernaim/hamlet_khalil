import { mkdir, readFile, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Admin-uploaded images live in public/uploads (gitignored). Seed images under
// /shrines are never touched by the cleanup helpers here.

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");
const PUBLIC_PREFIX = "/uploads/";

// Passport scans are PII and must never be web-accessible, so they live outside
// public/ and are served only through the session-guarded admin route.
const PRIVATE_DIR = path.join(process.cwd(), "private_uploads");
const PASSPORTS_DIR = path.join(PRIVATE_DIR, "passports");
const SAFE_TOKEN = /^[a-zA-Z0-9._-]+$/;

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

// ── Private passport files ──────────────────────────────────────────────────

// Saves a passport image to the private store and returns an opaque token
// (the filename). The token is meaningless without the guarded admin route.
export async function savePassport(file: File): Promise<string> {
  const ext = EXT_BY_MIME[file.type];
  const token = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
  await mkdir(PASSPORTS_DIR, { recursive: true });
  await writeFile(path.join(PASSPORTS_DIR, token), Buffer.from(await file.arrayBuffer()));
  return token;
}

// Reads a passport file for the admin serve route. Rejects anything that isn't
// a bare, safe filename (blocks path traversal). Returns null if missing.
export async function readPassport(
  token: string
): Promise<{ data: Buffer; contentType: string } | null> {
  if (!token || !SAFE_TOKEN.test(token) || token.includes("..")) return null;
  const ext = token.split(".").pop() ?? "";
  const contentType =
    Object.entries(EXT_BY_MIME).find(([, e]) => e === ext)?.[0] ?? "application/octet-stream";
  const resolved = path.join(PASSPORTS_DIR, token);
  if (!resolved.startsWith(PASSPORTS_DIR + path.sep)) return null;
  const data = await readFile(resolved).catch(() => null);
  return data ? { data, contentType } : null;
}

// Cheap existence check used when validating a submitted booking.
export async function passportExists(token: string): Promise<boolean> {
  if (!token || !SAFE_TOKEN.test(token) || token.includes("..")) return false;
  const resolved = path.join(PASSPORTS_DIR, token);
  if (!resolved.startsWith(PASSPORTS_DIR + path.sep)) return false;
  return stat(resolved).then((s) => s.isFile()).catch(() => false);
}

export async function removePassport(token: string | null | undefined): Promise<void> {
  if (!token || !SAFE_TOKEN.test(token) || token.includes("..")) return;
  const resolved = path.join(PASSPORTS_DIR, token);
  if (!resolved.startsWith(PASSPORTS_DIR + path.sep)) return;
  await unlink(resolved).catch(() => undefined);
}
