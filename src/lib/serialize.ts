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
    const trimmed = list.trim();
    // Already a JSON array string (e.g. a raw DB value round-tripped through a
    // reorder that resends the whole row) — parse it rather than comma-splitting.
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return JSON.stringify(parsed.map((v) => String(v).trim()).filter(Boolean));
        }
      } catch {
        // fall through to comma/newline parsing
      }
    }
    // accept newline- or comma-separated input from forms
    const items = trimmed
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    return JSON.stringify(items);
  }
  return "[]";
}
