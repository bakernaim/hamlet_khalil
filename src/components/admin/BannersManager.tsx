"use client";

import { useState } from "react";
import { useResource } from "@/components/admin/useResource";
import { Field, Input, Textarea, Select, Button, Modal, Toggle, ErrorText, ImageUpload } from "@/components/admin/ui";

interface Banner {
  id: string;
  titleAr: string;
  titleEn: string;
  badgeAr: string | null;
  badgeEn: string | null;
  textAr: string;
  textEn: string;
  image: string | null;
  theme: string;
  targetDate: string | null;
  priceFrom: number | null;
  noteAr: string | null;
  noteEn: string | null;
  ctaAr: string | null;
  ctaEn: string | null;
  sortOrder: number;
  published: boolean;
}

type FormState = {
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  textAr: string;
  textEn: string;
  image: string;
  theme: string;
  targetDate: string;
  priceFrom: string;
  noteAr: string;
  noteEn: string;
  ctaAr: string;
  ctaEn: string;
  sortOrder: string;
  published: boolean;
};

const empty: FormState = {
  titleAr: "",
  titleEn: "",
  badgeAr: "",
  badgeEn: "",
  textAr: "",
  textEn: "",
  image: "",
  theme: "green",
  targetDate: "",
  priceFrom: "",
  noteAr: "",
  noteEn: "",
  ctaAr: "",
  ctaEn: "",
  sortOrder: "0",
  published: true,
};

const isoToInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

function toForm(b: Banner): FormState {
  return {
    titleAr: b.titleAr,
    titleEn: b.titleEn,
    badgeAr: b.badgeAr ?? "",
    badgeEn: b.badgeEn ?? "",
    textAr: b.textAr,
    textEn: b.textEn,
    image: b.image ?? "",
    theme: b.theme,
    targetDate: isoToInput(b.targetDate),
    priceFrom: b.priceFrom == null ? "" : String(b.priceFrom),
    noteAr: b.noteAr ?? "",
    noteEn: b.noteEn ?? "",
    ctaAr: b.ctaAr ?? "",
    ctaEn: b.ctaEn ?? "",
    sortOrder: String(b.sortOrder),
    published: b.published,
  };
}

export default function BannersManager() {
  const { items, loading, error, save, remove } = useResource<Banner>("/api/admin/banners");
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
  function openEdit(b: Banner) {
    setEditingId(b.id);
    setForm(toForm(b));
    setFormError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const res = await save({ ...form, sortOrder: Number(form.sortOrder) }, editingId ?? undefined);
    setSaving(false);
    if (!res.ok) setFormError(res.error || "Save failed");
    else setOpen(false);
  }

  // Quick show/hide from the list without opening the modal.
  async function togglePublished(b: Banner) {
    const res = await save({ ...toForm(b), published: !b.published, sortOrder: b.sortOrder }, b.id);
    if (!res.ok) alert(res.error);
  }

  async function onDelete(b: Banner) {
    if (!confirm(`Delete "${b.titleEn || b.titleAr}"? Its uploaded image will also be removed.`)) return;
    const res = await remove(b.id);
    if (!res.ok) alert(res.error);
  }

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Banners</h1>
          <p className="text-ink/45 text-sm mt-1">
            Promo sections on the homepage — countdowns, campaigns, special offers.
          </p>
        </div>
        <Button onClick={openNew}>+ New Banner</Button>
      </header>

      <ErrorText>{error}</ErrorText>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-ink/40 text-sm">No banners yet. Add your first one.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-page-alt text-ink/50 text-left text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Banner</th>
                <th className="px-4 py-3 font-medium">Theme</th>
                <th className="px-4 py-3 font-medium">Countdown</th>
                <th className="px-4 py-3 font-medium">Visible</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16223a]">
              {items.map((b) => (
                <tr key={b.id} className="hover:bg-ink/[0.02]">
                  <td className="px-4 py-3">
                    <div className="text-ink font-medium">{b.titleEn || b.titleAr}</div>
                    <div className="text-ink/40 text-xs" dir="rtl">{b.titleAr}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        b.theme === "amber"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25"
                          : "bg-brand/10 text-accent border-brand/25"
                      }`}
                    >
                      {b.theme}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{fmt(b.targetDate)}</td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={b.published}
                      onChange={() => togglePublished(b)}
                      label={b.published ? "Shown" : "Hidden"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(b)} className="text-ink/60 hover:text-ink text-xs px-2 py-1 rounded border border-line hover:bg-ink/5">Edit</button>
                      <button onClick={() => onDelete(b)} className="text-red-600/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/25 hover:bg-red-500/10">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title={editingId ? "Edit Banner" : "New Banner"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title (EN)">
              <Input value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} />
            </Field>
            <Field label="Title (AR)">
              <Input dir="rtl" value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge (EN)" hint="Small chip above the title — optional">
              <Input value={form.badgeEn} onChange={(e) => set("badgeEn", e.target.value)} />
            </Field>
            <Field label="Badge (AR)">
              <Input dir="rtl" value={form.badgeAr} onChange={(e) => set("badgeAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Text (EN)">
              <Textarea rows={2} value={form.textEn} onChange={(e) => set("textEn", e.target.value)} />
            </Field>
            <Field label="Text (AR)">
              <Textarea rows={2} dir="rtl" value={form.textAr} onChange={(e) => set("textAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Theme">
              <Select value={form.theme} onChange={(e) => set("theme", e.target.value)}>
                <option value="green">Green</option>
                <option value="amber">Amber (Arbaeen style)</option>
              </Select>
            </Field>
            <Field label="Countdown date" hint="Optional — shows a live countdown">
              <Input type="date" value={form.targetDate} onChange={(e) => set("targetDate", e.target.value)} />
            </Field>
            <Field label="Price from (USD)" hint="Optional">
              <Input type="number" value={form.priceFrom} onChange={(e) => set("priceFrom", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price note (EN)" hint="e.g. 14 Days · All Inclusive">
              <Input value={form.noteEn} onChange={(e) => set("noteEn", e.target.value)} />
            </Field>
            <Field label="Price note (AR)">
              <Input dir="rtl" value={form.noteAr} onChange={(e) => set("noteAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Button label (EN)" hint="Defaults to “Contact Us”">
              <Input value={form.ctaEn} onChange={(e) => set("ctaEn", e.target.value)} />
            </Field>
            <Field label="Button label (AR)">
              <Input dir="rtl" value={form.ctaAr} onChange={(e) => set("ctaAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload
              label="Background image"
              hint="Optional — dark gradient is used when empty"
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
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Banner"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
