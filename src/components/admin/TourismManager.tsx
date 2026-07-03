"use client";

import { useState } from "react";
import { useResource } from "@/components/admin/useResource";
import { Field, Input, Textarea, Button, Modal, Toggle, ErrorText, ImageUpload } from "@/components/admin/ui";

interface Tourism {
  id: string;
  slug: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  price: number;
  descAr: string;
  descEn: string;
  image: string;
  sortOrder: number;
  published: boolean;
}

type FormState = {
  slug: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  price: string;
  descAr: string;
  descEn: string;
  image: string;
  sortOrder: string;
  published: boolean;
};

const empty: FormState = {
  slug: "",
  flag: "✈️",
  nameAr: "",
  nameEn: "",
  durationAr: "",
  durationEn: "",
  price: "0",
  descAr: "",
  descEn: "",
  image: "/shrines/turkey-istanbul.jpg",
  sortOrder: "0",
  published: true,
};

function toForm(t: Tourism): FormState {
  return {
    slug: t.slug,
    flag: t.flag,
    nameAr: t.nameAr,
    nameEn: t.nameEn,
    durationAr: t.durationAr,
    durationEn: t.durationEn,
    price: String(t.price),
    descAr: t.descAr,
    descEn: t.descEn,
    image: t.image,
    sortOrder: String(t.sortOrder),
    published: t.published,
  };
}

export default function TourismManager() {
  const { items, loading, error, save, remove } = useResource<Tourism>("/api/admin/tourism");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function openNew() {
    setEditingId(null);
    setForm(empty);
    setFormError("");
    setOpen(true);
  }
  function openEdit(t: Tourism) {
    setEditingId(t.id);
    setForm(toForm(t));
    setFormError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const res = await save(
      { ...form, price: Number(form.price), sortOrder: Number(form.sortOrder) },
      editingId ?? undefined
    );
    setSaving(false);
    if (!res.ok) setFormError(res.error || "Save failed");
    else setOpen(false);
  }

  async function onDelete(t: Tourism) {
    if (!confirm(`Delete "${t.nameEn || t.nameAr}"? This cannot be undone.`)) return;
    const res = await remove(t.id);
    if (!res.ok) alert(res.error);
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Tourism Packages</h1>
          <p className="text-ink/45 text-sm mt-1">Leisure travel packages shown on the homepage.</p>
        </div>
        <Button onClick={openNew}>+ New Package</Button>
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
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16223a]">
              {items.map((t) => (
                <tr key={t.id} className="hover:bg-ink/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.flag}</span>
                      <div>
                        <div className="text-ink font-medium">{t.nameEn}</div>
                        <div className="text-ink/40 text-xs" dir="rtl">{t.nameAr}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-accent font-semibold">${t.price}</td>
                  <td className="px-4 py-3 text-ink/60">{t.durationEn}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${t.published ? "bg-brand/15 text-accent" : "bg-ink/8 text-ink/40"}`}>
                      {t.published ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(t)} className="text-ink/60 hover:text-ink text-xs px-2 py-1 rounded border border-line hover:bg-ink/5">Edit</button>
                      <button onClick={() => onDelete(t)} className="text-red-600/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/25 hover:bg-red-500/10">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title={editingId ? "Edit Package" : "New Package"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug (unique id)" hint="e.g. turkey, dubai">
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
            </Field>
            <Field label="Flag emoji">
              <Input value={form.flag} onChange={(e) => set("flag", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name (English)">
              <Input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} />
            </Field>
            <Field label="Name (Arabic)">
              <Input dir="rtl" value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Duration (EN)" hint="e.g. 7 Days">
              <Input value={form.durationEn} onChange={(e) => set("durationEn", e.target.value)} />
            </Field>
            <Field label="Duration (AR)">
              <Input dir="rtl" value={form.durationAr} onChange={(e) => set("durationAr", e.target.value)} />
            </Field>
            <Field label="Price (USD)">
              <Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Description (EN)">
              <Textarea rows={3} value={form.descEn} onChange={(e) => set("descEn", e.target.value)} />
            </Field>
            <Field label="Description (AR)">
              <Textarea rows={3} dir="rtl" value={form.descAr} onChange={(e) => set("descAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload
              label="Image"
              hint="Shown on the package card"
              value={form.image}
              onChange={(p) => set("image", p)}
            />
            <Field label="Sort order" hint="Lower shows first">
              <Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
            </Field>
          </div>
          <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published (visible on site)" />

          <ErrorText>{formError}</ErrorText>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Package"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
