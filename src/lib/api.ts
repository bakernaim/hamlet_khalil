import { NextResponse } from "next/server";

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function forbidden(message = "You don't have permission to do this") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function serverError(message = "Something went wrong") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function str(v: unknown, fallback = ""): string {
  return v == null ? fallback : String(v).trim();
}

export function optionalStr(v: unknown): string | null {
  const s = str(v);
  return s === "" ? null : s;
}

export function int(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export function optionalInt(v: unknown): number | null {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export function bool(v: unknown, fallback = true): boolean {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === "on" || v === 1 || v === "1") return true;
  if (v === "false" || v === "off" || v === 0 || v === "0") return false;
  return fallback;
}

export function optionalDate(v: unknown): Date | null {
  const s = str(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}
