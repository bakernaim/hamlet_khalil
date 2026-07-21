"use client";

import { useState } from "react";
import Image from "next/image";
import { useResource } from "@/components/admin/useResource";
import { Field, Input, Button, Modal, Toggle, ErrorText, ImageUpload } from "@/components/admin/ui";

interface Flight {
  id: string;
  fromAr: string;
  fromEn: string;
  toAr: string;
  toEn: string;
  airlineAr: string;
  airlineEn: string;
  mealIncluded: boolean;
  price: number;
  image: string | null;
  sortOrder: number;
  published: boolean;
}

type FormState = {
  fromAr: string;
  fromEn: string;
  toAr: string;
  toEn: string;
  airlineAr: string;
  airlineEn: string;
  mealIncluded: boolean;
  price: string;
  image: string;
  sortOrder: string;
  published: boolean;
};

const empty: FormState = {
  fromAr: "",
  fromEn: "",
  toAr: "",
  toEn: "",
  airlineAr: "",
  airlineEn: "",
  mealIncluded: false,
  price: "0",
  image: "",
  sortOrder: "0",
  published: true,
};

export default function FlightsManager() {
  const { items, loading, error, save, remove } = useResource<Flight>("/api/admin/flights");
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

  function openEdit(f: Flight) {
    setEditingId(f.id);
    setForm({
      fromAr: f.fromAr,
      fromEn: f.fromEn,
      toAr: f.toAr,
      toEn: f.toEn,
      airlineAr: f.airlineAr,
      airlineEn: f.airlineEn,
      mealIncluded: f.mealIncluded,
      price: String(f.price),
      image: f.image ?? "",
      sortOrder: String(f.sortOrder),
      published: f.published,
    });
    setFormError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fromEn.trim() && !form.fromAr.trim()) return setFormError("A departure city is required");
    if (!form.toEn.trim() && !form.toAr.trim()) return setFormError("A destination city is required");
    if (!form.airlineEn.trim() && !form.airlineAr.trim()) return setFormError("An airline is required");

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

  async function togglePublished(f: Flight) {
    const res = await save(
      {
        fromAr: f.fromAr,
        fromEn: f.fromEn,
        toAr: f.toAr,
        toEn: f.toEn,
        airlineAr: f.airlineAr,
        airlineEn: f.airlineEn,
        mealIncluded: f.mealIncluded,
        price: f.price,
        image: f.image ?? "",
        sortOrder: f.sortOrder,
        published: !f.published,
      },
      f.id
    );
    if (!res.ok) alert(res.error);
  }

  async function onDelete(f: Flight) {
    if (!confirm(`Delete this flight (${f.fromEn || f.fromAr} → ${f.toEn || f.toAr})? This can't be undone.`)) return;
    const res = await remove(f.id);
    if (!res.ok) alert(res.error);
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Flights</h1>
          <p className="text-ink/45 text-sm mt-1">
            Plane tickets we can help customers book — shown on the website&apos;s flight-booking section.
          </p>
        </div>
        <Button onClick={openNew}>+ Add Flight</Button>
      </header>

      <ErrorText>{error}</ErrorText>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-ink/40 text-sm">No flights yet. Add your first one.</p>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div key={f.id} className="rounded-2xl border border-line bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex gap-3">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-line bg-page-alt shrink-0">
                    {f.image ? (
                      <Image src={f.image} alt="" fill className="object-cover" sizes="80px" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-ink/25 text-lg">✈️</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-ink font-semibold">
                        {f.fromEn || f.fromAr} → {f.toEn || f.toAr}
                      </span>
                      {!f.published && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/90 text-black">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="text-ink/60 text-sm mt-1">🛫 {f.airlineEn || f.airlineAr}</div>
                    <div className="text-ink/50 text-xs mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>💵 ${f.price.toLocaleString("en-US")}</span>
                      <span>{f.mealIncluded ? "🍽️ Meal included" : "🚫 No meal"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Toggle checked={f.published} onChange={() => togglePublished(f)} label={f.published ? "Shown" : "Hidden"} />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEdit(f)}
                      className="text-ink/60 hover:text-ink text-xs px-2 py-1 rounded border border-line hover:bg-ink/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(f)}
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

      <Modal open={open} title={editingId ? "Edit Flight" : "Add Flight"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <ImageUpload label="Airline photo / logo" hint="Optional" value={form.image} onChange={(v) => set("image", v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="From (EN)">
              <Input value={form.fromEn} onChange={(e) => set("fromEn", e.target.value)} placeholder="Beirut" />
            </Field>
            <Field label="From (AR)">
              <Input dir="rtl" value={form.fromAr} onChange={(e) => set("fromAr", e.target.value)} placeholder="بيروت" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="To (EN)">
              <Input value={form.toEn} onChange={(e) => set("toEn", e.target.value)} placeholder="Najaf" />
            </Field>
            <Field label="To (AR)">
              <Input dir="rtl" value={form.toAr} onChange={(e) => set("toAr", e.target.value)} placeholder="النجف" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Airline (EN)">
              <Input value={form.airlineEn} onChange={(e) => set("airlineEn", e.target.value)} placeholder="Middle East Airlines" />
            </Field>
            <Field label="Airline (AR)">
              <Input dir="rtl" value={form.airlineAr} onChange={(e) => set("airlineAr", e.target.value)} placeholder="طيران الشرق الأوسط" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <Field label="Price (USD)" hint="Per ticket">
              <Input type="number" min="0" dir="ltr" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </Field>
            <div className="pb-1">
              <Toggle checked={form.mealIncluded} onChange={(v) => set("mealIncluded", v)} label="Meal served on board" />
            </div>
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
