"use client";

import { useState } from "react";
import Image from "next/image";
import { useResource } from "@/components/admin/useResource";
import { Field, Input, Button, Modal, Toggle, ErrorText, ImageUpload } from "@/components/admin/ui";

interface InstagramPost {
  id: string;
  image: string;
  permalink: string;
  captionAr: string | null;
  captionEn: string | null;
  sortOrder: number;
  published: boolean;
}

type FormState = {
  image: string;
  permalink: string;
  captionAr: string;
  captionEn: string;
  sortOrder: string;
  published: boolean;
};

const empty: FormState = {
  image: "",
  permalink: "",
  captionAr: "",
  captionEn: "",
  sortOrder: "0",
  published: true,
};

export default function InstagramManager() {
  const { items, loading, error, save, remove } = useResource<InstagramPost>("/api/admin/instagram");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  function openNew() {
    setEditingId(null);
    setForm(empty);
    setFormError("");
    setOpen(true);
  }
  function openEdit(p: InstagramPost) {
    setEditingId(p.id);
    setForm({
      image: p.image,
      permalink: p.permalink,
      captionAr: p.captionAr ?? "",
      captionEn: p.captionEn ?? "",
      sortOrder: String(p.sortOrder),
      published: p.published,
    });
    setFormError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image) return setFormError("Please upload a photo first");
    setSaving(true);
    setFormError("");
    const res = await save({ ...form, sortOrder: Number(form.sortOrder) }, editingId ?? undefined);
    setSaving(false);
    if (!res.ok) setFormError(res.error || "Save failed");
    else setOpen(false);
  }

  async function togglePublished(p: InstagramPost) {
    const res = await save(
      {
        image: p.image,
        permalink: p.permalink,
        captionAr: p.captionAr ?? "",
        captionEn: p.captionEn ?? "",
        sortOrder: p.sortOrder,
        published: !p.published,
      },
      p.id
    );
    if (!res.ok) alert(res.error);
  }

  async function onDelete(p: InstagramPost) {
    if (!confirm("Delete this Instagram post? The uploaded image will also be removed.")) return;
    const res = await remove(p.id);
    if (!res.ok) alert(res.error);
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Instagram</h1>
          <p className="text-ink/45 text-sm mt-1">
            Posts shown in the website&apos;s Instagram section. Upload the image and paste the post link so it stays current.
          </p>
        </div>
        <Button onClick={openNew}>+ Add Post</Button>
      </header>

      <ErrorText>{error}</ErrorText>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-ink/40 text-sm">No posts yet. Add your first one — until then the site shows default images.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line bg-card overflow-hidden">
              <div className="relative aspect-square bg-page-alt">
                <Image src={p.image} alt={p.captionEn ?? ""} fill className="object-cover" sizes="240px" />
                {!p.published && (
                  <span className="absolute top-2 end-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/90 text-black">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="text-ink text-xs font-medium truncate">{p.captionEn || p.captionAr || "—"}</div>
                {p.permalink && (
                  <a
                    href={p.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent text-[11px] hover:underline truncate block mt-0.5"
                  >
                    View post ↗
                  </a>
                )}
                <div className="flex items-center justify-between mt-2.5">
                  <Toggle checked={p.published} onChange={() => togglePublished(p)} label={p.published ? "Shown" : "Hidden"} />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-ink/60 hover:text-ink text-xs px-2 py-1 rounded border border-line hover:bg-ink/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p)}
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

      <Modal open={open} title={editingId ? "Edit Post" : "Add Post"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <ImageUpload label="Photo" value={form.image} onChange={(v) => set("image", v)} />
          <Field label="Post link" hint="Optional — the image links to this Instagram post when set">
            <Input
              dir="ltr"
              value={form.permalink}
              onChange={(e) => set("permalink", e.target.value)}
              placeholder="https://www.instagram.com/p/…"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Caption (EN)" hint="Optional">
              <Input value={form.captionEn} onChange={(e) => set("captionEn", e.target.value)} />
            </Field>
            <Field label="Caption (AR)" hint="Optional">
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
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
