"use client";

import Link from "next/link";
import { useResource } from "@/components/admin/useResource";
import { Button, ErrorText } from "@/components/admin/ui";

interface Ziyarat {
  id: string;
  slug: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  infoAr: string;
  infoEn: string;
  published: boolean;
}

export default function ZiyaratManager() {
  const { items, loading, error, remove } = useResource<Ziyarat>("/api/admin/ziyarat");

  async function onDelete(z: Ziyarat) {
    if (!confirm(`Delete "${z.nameEn || z.nameAr}"? This cannot be undone.`)) return;
    const res = await remove(z.id);
    if (!res.ok) alert(res.error);
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Ziyarat Packages</h1>
          <p className="text-ink/45 text-sm mt-1">Pilgrimage packages shown on the homepage.</p>
        </div>
        <Link href="/admin/ziyarat/new">
          <Button>+ New Package</Button>
        </Link>
      </header>

      <ErrorText>{error}</ErrorText>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-ink/40 text-sm">No packages yet. Add your first one.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-page-alt text-ink/50 text-left text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Package</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Info</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16223a]">
              {items.map((z) => (
                <tr key={z.id} className="hover:bg-ink/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{z.flag}</span>
                      <div>
                        <div className="text-ink font-medium">{z.nameEn}</div>
                        <div className="text-ink/40 text-xs" dir="rtl">{z.nameAr}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{z.durationEn}</td>
                  <td className="px-4 py-3 text-ink/60 text-xs">
                    {z.infoAr || z.infoEn ? "✓ Added" : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${z.published ? "bg-brand/15 text-accent" : "bg-ink/8 text-ink/40"}`}>
                      {z.published ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/ziyarat/${z.id}`} className="text-ink/60 hover:text-ink text-xs px-2 py-1 rounded border border-line hover:bg-ink/5">Edit</Link>
                      <button onClick={() => onDelete(z)} className="text-red-600/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/25 hover:bg-red-500/10">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
