"use client";

import { useState } from "react";
import { useResource } from "@/components/admin/useResource";
import { Field, Input, Textarea, Button, Modal, Toggle, ErrorText, ImageUpload } from "@/components/admin/ui";
import { parseList } from "@/lib/serialize";

interface Ziyarat {
  id: string;
  slug: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  price: number;
  badgeAr: string | null;
  badgeEn: string | null;
  highlightsAr: string;
  highlightsEn: string;
  image: string;
  color: string;
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
  badgeAr: string;
  badgeEn: string;
  highlightsAr: string;
  highlightsEn: string;
  image: string;
  color: string;
  sortOrder: string;
  published: boolean;
};

const empty: FormState = {
  slug: "",
  flag: "🕌",
  nameAr: "",
  nameEn: "",
  durationAr: "",
  durationEn: "",
  price: "0",
  badgeAr: "",
  badgeEn: "",
  highlightsAr: "",
  highlightsEn: "",
  image: "/shrines/hussain-karbala.jpg",
  color: "from-[#1a2444] to-[#0a0f2c]",
  sortOrder: "0",
  published: true,
};

function toForm(z: Ziyarat): FormState {
  return {
    slug: z.slug,
    flag: z.flag,
    nameAr: z.nameAr,
    nameEn: z.nameEn,
    durationAr: z.durationAr,
    durationEn: z.durationEn,
    price: String(z.price),
    badgeAr: z.badgeAr ?? "",
    badgeEn: z.badgeEn ?? "",
    highlightsAr: parseList(z.highlightsAr).join("\n"),
    highlightsEn: parseList(z.highlightsEn).join("\n"),
    image: z.image,
    color: z.color,
    sortOrder: String(z.sortOrder),
    published: z.published,
  };
}

export default function ZiyaratManager() {
  const { items, loading, error, save, remove } = useResource<Ziyarat>("/api/admin/ziyarat");
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
  function openEdit(z: Ziyarat) {
    setEditingId(z.id);
    setForm(toForm(z));
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
                  <td className="px-4 py-3 text-accent font-semibold">${z.price}</td>
                  <td className="px-4 py-3 text-ink/60">{z.durationEn}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${z.published ? "bg-[#00b86a]/15 text-accent" : "bg-ink/8 text-ink/40"}`}>
                      {z.published ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(z)} className="text-ink/60 hover:text-ink text-xs px-2 py-1 rounded border border-line hover:bg-ink/5">Edit</button>
                      <button onClick={() => onDelete(z)} className="text-red-600/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/25 hover:bg-red-500/10">Delete</button>
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
            <Field label="Slug (unique id)" hint="e.g. iraq, iran, arbaeen">
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
            <Field label="Badge (EN)" hint="Optional, e.g. Most Popular 🔥">
              <Input value={form.badgeEn} onChange={(e) => set("badgeEn", e.target.value)} />
            </Field>
            <Field label="Badge (AR)" hint="Leave empty for none">
              <Input dir="rtl" value={form.badgeAr} onChange={(e) => set("badgeAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Highlights (EN)" hint="One per line">
              <Textarea rows={4} value={form.highlightsEn} onChange={(e) => set("highlightsEn", e.target.value)} />
            </Field>
            <Field label="Highlights (AR)" hint="One per line">
              <Textarea rows={4} dir="rtl" value={form.highlightsAr} onChange={(e) => set("highlightsAr", e.target.value)} />
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
