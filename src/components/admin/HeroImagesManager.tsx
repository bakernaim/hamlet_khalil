"use client";

import { useRef, useState } from "react";
import { useResource } from "@/components/admin/useResource";
import { Button, Toggle, ErrorText } from "@/components/admin/ui";

interface HeroImage {
  id: string;
  src: string;
  sortOrder: number;
  published: boolean;
}

// Built-in fallback used by the public Hero when no photos are uploaded/published.
const DEFAULT_IMAGE = "/shrines/hussain-karbala.jpg";

export default function HeroImagesManager() {
  const { items, loading, error, save, remove, reload } = useResource<HeroImage>("/api/admin/hero-images");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Upload failed");
        return;
      }
      const created = await save({ src: data.path, sortOrder: items.length, published: true });
      if (!created.ok) setUploadError(created.error || "Save failed");
    } catch {
      setUploadError("Network error");
    } finally {
      setUploading(false);
    }
  }

  async function togglePublished(h: HeroImage) {
    const res = await save({ sortOrder: h.sortOrder, published: !h.published }, h.id);
    if (!res.ok) alert(res.error);
  }

  async function onDelete(h: HeroImage) {
    if (!confirm("Delete this hero photo? The uploaded file will also be removed.")) return;
    const res = await remove(h.id);
    if (!res.ok) alert(res.error);
  }

  // Move a photo up/down in the carousel order. Persists sortOrder for any
  // row whose position changed, then reloads once.
  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const ordered = [...items];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    await Promise.all(
      ordered
        .map((h, i) => ({ h, i }))
        .filter(({ h, i }) => h.sortOrder !== i)
        .map(({ h, i }) =>
          fetch(`/api/admin/hero-images/${h.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...h, sortOrder: i }),
          })
        )
    );
    await reload();
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Hero Background Images</h1>
          <p className="text-ink/45 text-sm mt-1">
            Photos cycled with a crossfade animation behind the homepage hero. Use the ▲▼ arrows
            to set the order. At least one photo must stay published, or the site falls back to a
            default image.
          </p>
        </div>
        <div>
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "+ Add Photo"}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={onFile}
          />
        </div>
      </header>

      <ErrorText>{error || uploadError}</ErrorText>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Built-in fallback — read-only, always shown so admins can see what's live
              when no uploaded photo is published. */}
          <div className="rounded-2xl border border-line bg-card overflow-hidden">
            <div className="relative aspect-video bg-page-alt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DEFAULT_IMAGE} alt="Default hero background" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute top-2 start-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-black/55 text-white">
                Default
              </span>
            </div>
            <div className="p-3">
              <p className="text-ink/45 text-xs">
                {items.some((h) => h.published)
                  ? "Fallback — used only if all uploaded photos are hidden."
                  : "Currently live — upload a photo above to replace it."}
              </p>
            </div>
          </div>

          {items.map((h, i) => (
            <div key={h.id} className="rounded-2xl border border-line bg-card overflow-hidden">
              <div className="relative aspect-video bg-page-alt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                {!h.published && (
                  <span className="absolute top-2 end-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/90 text-black">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      title="Move up"
                      className="text-ink/50 hover:text-ink disabled:opacity-25 disabled:cursor-not-allowed leading-none px-1"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === items.length - 1}
                      title="Move down"
                      className="text-ink/50 hover:text-ink disabled:opacity-25 disabled:cursor-not-allowed leading-none px-1"
                    >
                      ▼
                    </button>
                  </div>
                  <Toggle checked={h.published} onChange={() => togglePublished(h)} label={h.published ? "Shown" : "Hidden"} />
                </div>
                <button
                  onClick={() => onDelete(h)}
                  className="w-full text-red-600/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/25 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
