import { mkdir, readFile, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Everything uploaded through the app lives under private_uploads/ (gitignored),
// outside public/, so nothing is served as a raw static file. Seed images under
// public/shrines are never touched by the cleanup helpers here.
const PRIVATE_DIR = path.join(process.cwd(), "private_uploads");

// Admin-uploaded images (banners, package/trip photos). These are public content,
// streamed through the unguarded /api/media/[name] route.
const IMAGES_DIR = path.join(PRIVATE_DIR, "images");
const MEDIA_PREFIX = "/api/media/";

// Passport scans are PII and must never be web-accessible, so they're served only
// through the session-guarded admin route.
const PASSPORTS_DIR = path.join(PRIVATE_DIR, "passports");
const SAFE_TOKEN = /^[a-zA-Z0-9._-]+$/;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

// Gallery videos — kept separate so image-only uploads stay strict.
const VIDEO_EXT_BY_MIME: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_UPLOAD_BYTES = 100 * 1024 * 1024;

const mimeForExt = (ext: string): string =>
  Object.entries({ ...EXT_BY_MIME, ...VIDEO_EXT_BY_MIME }).find(([, e]) => e === ext)?.[0] ??
  "application/octet-stream";

// Returns an error message for an invalid upload, or null if it's acceptable.
// `allowVideo` is used by the gallery, which also accepts MP4/WebM clips.
export function uploadProblem(file: unknown, allowVideo = false): string | null {
  if (!(file instanceof File) || file.size === 0) return "No file provided";
  if (allowVideo && VIDEO_EXT_BY_MIME[file.type]) {
    return file.size > MAX_VIDEO_UPLOAD_BYTES ? "Video is too large (max 100 MB)" : null;
  }
  if (!EXT_BY_MIME[file.type]) {
    return allowVideo
      ? "Unsupported file — use JPEG, PNG, WebP, GIF, AVIF, MP4 or WebM"
      : "Unsupported image type — use JPEG, PNG, WebP, GIF or AVIF";
  }
  if (file.size > MAX_UPLOAD_BYTES) return "Image is too large (max 5 MB)";
  return null;
}

export const isVideoUpload = (file: File): boolean => Boolean(VIDEO_EXT_BY_MIME[file.type]);

// Writes the file under a unique name and returns its serve path (/api/media/…).
export async function saveUpload(file: File): Promise<string> {
  const ext = EXT_BY_MIME[file.type] ?? VIDEO_EXT_BY_MIME[file.type];
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  await mkdir(IMAGES_DIR, { recursive: true });
  await writeFile(path.join(IMAGES_DIR, name), Buffer.from(await file.arrayBuffer()));
  return MEDIA_PREFIX + name;
}

// Resolves an uploaded file for streaming (videos are served with Range
// support instead of being buffered whole). Same traversal guards as readMedia.
export async function statMedia(
  name: string
): Promise<{ absPath: string; contentType: string; size: number } | null> {
  if (!name || !SAFE_TOKEN.test(name) || name.includes("..")) return null;
  const resolved = path.join(IMAGES_DIR, name);
  if (!resolved.startsWith(IMAGES_DIR + path.sep)) return null;
  const s = await stat(resolved).catch(() => null);
  if (!s?.isFile()) return null;
  return { absPath: resolved, contentType: mimeForExt(name.split(".").pop() ?? ""), size: s.size };
}

// Deletes a previously uploaded image. No-op for anything not served from
// /api/media/ (seed images, external URLs, empty values) and for missing files.
export async function removeUpload(imagePath: string | null | undefined): Promise<void> {
  if (!imagePath || !imagePath.startsWith(MEDIA_PREFIX)) return;
  const name = imagePath.slice(MEDIA_PREFIX.length);
  if (!SAFE_TOKEN.test(name) || name.includes("..")) return;
  const resolved = path.join(IMAGES_DIR, name);
  if (!resolved.startsWith(IMAGES_DIR + path.sep)) return;
  await unlink(resolved).catch(() => undefined);
}

// Removes every upload in `paths`. Safe on non-media paths (seed images etc.).
export async function removeUploads(paths: (string | null | undefined)[]): Promise<void> {
  await Promise.all(paths.map((p) => removeUpload(p)));
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
