"use client";

import { useRef, useState } from "react";
import { useResource } from "@/components/admin/useResource";
import { Field, Input, Button, Modal, Toggle, ErrorText } from "@/components/admin/ui";

interface GalleryItem {
  id: string;
  type: string; // "image" | "video"
  src: string;
  captionAr: string | null;
  captionEn: string | null;
  sortOrder: number;
  published: boolean;
}

type FormState = {
  type: string;
  src: string;
  captionAr: string;
  captionEn: string;
  sortOrder: string;
  published: boolean;
};

const empty: FormState = { type: "image", src: "", captionAr: "", captionEn: "", sortOrder: "0", published: true };

export default function GalleryManager() {
  const { items, loading, error, save, remove } = useResource<GalleryItem>("/api/admin/gallery");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  function openNew() {
    setEditingId(null);
    setForm(empty);
    setFormError("");
    setOpen(true);
  }
  function openEdit(g: GalleryItem) {
    setEditingId(g.id);
    setForm({
      type: g.type,
      src: g.src,
      captionAr: g.captionAr ?? "",
      captionEn: g.captionEn ?? "",
      sortOrder: String(g.sortOrder),
      published: g.published,
    });
    setFormError("");
    setOpen(true);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setFormError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("video", "1"); // gallery also accepts MP4/WebM
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) setFormError(data.error || "Upload failed");
      else setForm((f) => ({ ...f, src: data.path, type: data.type }));
    } catch {
      setFormError("Network error");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.src) return setFormError("Please upload a photo or video first");
    setSaving(true);
    setFormError("");
    const res = await save({ ...form, sortOrder: Number(form.sortOrder) }, editingId ?? undefined);
    setSaving(false);
    if (!res.ok) setFormError(res.error || "Save failed");
    else setOpen(false);
  }

  async function togglePublished(g: GalleryItem) {
    const res = await save(
      {
        captionAr: g.captionAr ?? "",
        captionEn: g.captionEn ?? "",
        sortOrder: g.sortOrder,
        published: !g.published,
      },
      g.id
    );
    if (!res.ok) alert(res.error);
  }

  async function onDelete(g: GalleryItem) {
    if (!confirm("Delete this media? The uploaded file will also be removed.")) return;
    const res = await remove(g.id);
    if (!res.ok) alert(res.error);
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gallery</h1>
          <p className="text-ink/45 text-sm mt-1">
            Trip photos & short videos shown in the website&apos;s gallery section.
          </p>
        </div>
        <Button onClick={openNew}>+ Add Media</Button>
      </header>

      <ErrorText>{error}</ErrorText>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-ink/40 text-sm">No media yet. Upload your first photo or video.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((g) => (
            <div key={g.id} className="rounded-2xl border border-line bg-card overflow-hidden">
              <div className="relative aspect-video bg-page-alt">
                {g.type === "video" ? (
                  <video src={g.src} preload="metadata" muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.src} alt={g.captionEn ?? ""} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <span className="absolute top-2 start-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-black/55 text-white">
                  {g.type}
                </span>
                {!g.published && (
                  <span className="absolute top-2 end-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/90 text-black">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="text-ink text-xs font-medium truncate">{g.captionEn || g.captionAr || "—"}</div>
                <div className="flex items-center justify-between mt-2.5">
                  <Toggle checked={g.published} onChange={() => togglePublished(g)} label={g.published ? "Shown" : "Hidden"} />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEdit(g)}
                      className="text-ink/60 hover:text-ink text-xs px-2 py-1 rounded border border-line hover:bg-ink/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(g)}
                      className="text-red-600/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/25 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title={editingId ? "Edit Media" : "Add Media"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Upload / preview — the file is fixed once created; replace = delete + re-add */}
          <div>
            <span className="block text-xs font-medium text-ink/70 mb-1.5">
              {editingId ? "Media (fixed — delete the item to replace it)" : "Photo or video"}
            </span>
            <div className="flex items-center gap-3">
              <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-line bg-page-alt shrink-0 grid place-items-center">
                {form.src ? (
                  form.type === "video" ? (
                    <video src={form.src} preload="metadata" muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )
                ) : (
                  <span className="text-ink/30 text-2xl">🖼️</span>
                )}
              </div>
              {!editingId && (
                <div>
                  <Button type="button" variant="ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? "Uploading…" : form.src ? "Change file" : "Choose file"}
                  </Button>
                  <p className="text-ink/40 text-[11px] mt-1.5">
                    JPEG/PNG/WebP/GIF/AVIF up to 5 MB · MP4/WebM up to 100 MB
                  </p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm"
                className="hidden"
                onChange={onFile}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Caption (EN)" hint="Optional">
              <Input value={form.captionEn} onChange={(e) => set("captionEn", e.target.value)} />
            </Field>
            <Field label="Caption (AR)">
              <Input dir="rtl" value={form.captionAr} onChange={(e) => set("captionAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <Field label="Sort order" hint="Lower shows first">
              <Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
            </Field>
            <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published (visible on site)" />
          </div>

          <ErrorText>{formError}</ErrorText>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving || uploading}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
