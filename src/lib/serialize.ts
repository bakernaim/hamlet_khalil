// Helpers for the JSON-string list columns (e.g. highlights) stored in SQLite.

export function parseList(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function stringifyList(list: unknown): string {
  if (Array.isArray(list)) return JSON.stringify(list.map((v) => String(v).trim()).filter(Boolean));
  if (typeof list === "string") {
    // accept newline- or comma-separated input from forms
    const items = list
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    return JSON.stringify(items);
  }
  return "[]";
}
