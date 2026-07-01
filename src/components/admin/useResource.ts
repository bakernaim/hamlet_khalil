"use client";

import { useCallback, useEffect, useState } from "react";

type WithId = { id: string };

export function useResource<T extends WithId>(base: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(base, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      setItems(await res.json());
    } catch {
      setError("Could not load data");
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(
    payload: Record<string, unknown>,
    id?: string
  ): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch(id ? `${base}/${id}` : base, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error || "Save failed" };
    await load();
    return { ok: true };
  }

  async function remove(id: string): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch(`${base}/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error || "Delete failed" };
    await load();
    return { ok: true };
  }

  return { items, loading, error, reload: load, save, remove };
}
