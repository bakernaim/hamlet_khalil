"use client";

import { useState } from "react";
import Image from "next/image";
import { useResource } from "@/components/admin/useResource";
import { Field, Input, Button, Modal, Toggle, ErrorText, ImageUpload, MultiImageUpload, ChipsInput } from "@/components/admin/ui";

interface Hotel {
  id: string;
  countryAr: string;
  countryEn: string;
  cityAr: string;
  cityEn: string;
  nameAr: string;
  nameEn: string;
  addressAr: string | null;
  addressEn: string | null;
  image: string | null;
  images: string; // JSON string — parsed for display only
  roomTypesAr: string; // JSON string — parsed for display only
  roomTypesEn: string;
  priceStart: number | null;
  mealBreakfast: boolean;
  mealLunch: boolean;
  mealDinner: boolean;
  website: string | null;
  sortOrder: number;
  published: boolean;
}

type FormState = {
  countryAr: string;
  countryEn: string;
  cityAr: string;
  cityEn: string;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  image: string;
  images: string[];
  roomTypesAr: string[]; // chips; stringified on save
  roomTypesEn: string[];
  priceStart: string;
  mealBreakfast: boolean;
  mealLunch: boolean;
  mealDinner: boolean;
  website: string;
  sortOrder: string;
  published: boolean;
};

const empty: FormState = {
  countryAr: "",
  countryEn: "",
  cityAr: "",
  cityEn: "",
  nameAr: "",
  nameEn: "",
  addressAr: "",
  addressEn: "",
  image: "",
  images: [],
  roomTypesAr: [],
  roomTypesEn: [],
  priceStart: "",
  mealBreakfast: false,
  mealLunch: false,
  mealDinner: false,
  website: "",
  sortOrder: "0",
  published: true,
};

function parseJsonList(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export default function HotelsManager() {
  const { items, loading, error, save, remove } = useResource<Hotel>("/api/admin/hotels");
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

  function openEdit(h: Hotel) {
    setEditingId(h.id);
    setForm({
      countryAr: h.countryAr,
      countryEn: h.countryEn,
      cityAr: h.cityAr,
      cityEn: h.cityEn,
      nameAr: h.nameAr,
      nameEn: h.nameEn,
      addressAr: h.addressAr ?? "",
      addressEn: h.addressEn ?? "",
      image: h.image ?? "",
      images: parseJsonList(h.images),
      roomTypesAr: parseJsonList(h.roomTypesAr),
      roomTypesEn: parseJsonList(h.roomTypesEn),
      priceStart: h.priceStart != null ? String(h.priceStart) : "",
      mealBreakfast: h.mealBreakfast,
      mealLunch: h.mealLunch,
      mealDinner: h.mealDinner,
      website: h.website ?? "",
      sortOrder: String(h.sortOrder),
      published: h.published,
    });
    setFormError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameEn.trim() && !form.nameAr.trim()) return setFormError("A hotel name is required");
    if (!form.cityEn.trim() && !form.cityAr.trim()) return setFormError("A city is required");
    if (!form.countryEn.trim() && !form.countryAr.trim()) return setFormError("A country is required");

    setSaving(true);
    setFormError("");
    const res = await save({ ...form, sortOrder: Number(form.sortOrder) }, editingId ?? undefined);
    setSaving(false);
    if (!res.ok) setFormError(res.error || "Save failed");
    else setOpen(false);
  }

  async function togglePublished(h: Hotel) {
    const res = await save(
      {
        countryAr: h.countryAr,
        countryEn: h.countryEn,
        cityAr: h.cityAr,
        cityEn: h.cityEn,
        nameAr: h.nameAr,
        nameEn: h.nameEn,
        addressAr: h.addressAr ?? "",
        addressEn: h.addressEn ?? "",
        image: h.image ?? "",
        images: parseJsonList(h.images),
        roomTypesAr: parseJsonList(h.roomTypesAr),
        roomTypesEn: parseJsonList(h.roomTypesEn),
        priceStart: h.priceStart,
        mealBreakfast: h.mealBreakfast,
        mealLunch: h.mealLunch,
        mealDinner: h.mealDinner,
        website: h.website ?? "",
        sortOrder: h.sortOrder,
        published: !h.published,
      },
      h.id
    );
    if (!res.ok) alert(res.error);
  }

  async function onDelete(h: Hotel) {
    if (!confirm(`Delete "${h.nameEn || h.nameAr}"? This can't be undone.`)) return;
    const res = await remove(h.id);
    if (!res.ok) alert(res.error);
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Hotels</h1>
          <p className="text-ink/45 text-sm mt-1">
            Hotels we can help customers book — shown on the website&apos;s hotel-booking section.
          </p>
        </div>
        <Button onClick={openNew}>+ Add Hotel</Button>
      </header>

      <ErrorText>{error}</ErrorText>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-ink/40 text-sm">No hotels yet. Add your first one.</p>
      ) : (
        <div className="space-y-3">
          {items.map((h) => (
            <div key={h.id} className="rounded-2xl border border-line bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex gap-3">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-line bg-page-alt shrink-0">
                    {h.image ? (
                      <Image src={h.image} alt="" fill className="object-cover" sizes="80px" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-ink/25 text-lg">🏨</span>
                    )}
                  </div>
                  <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-ink font-semibold">{h.nameEn || h.nameAr}</span>
                    {!h.published && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/90 text-black">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="text-ink/60 text-sm mt-1">
                    📍 {h.cityEn || h.cityAr}, {h.countryEn || h.countryAr}
                  </div>
                  {(h.addressEn || h.addressAr) && (
                    <div className="text-ink/45 text-xs mt-1">{h.addressEn || h.addressAr}</div>
                  )}
                  <div className="text-ink/50 text-xs mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    {parseJsonList(h.roomTypesEn).length > 0 && (
                      <span>🛏️ {parseJsonList(h.roomTypesEn).join(", ")}</span>
                    )}
                    {h.priceStart != null && <span>💵 From ${h.priceStart.toLocaleString("en-US")}</span>}
                    {(h.mealBreakfast || h.mealLunch || h.mealDinner) && (
                      <span>
                        🍽️{" "}
                        {[
                          h.mealBreakfast && "Breakfast",
                          h.mealLunch && "Lunch",
                          h.mealDinner && "Dinner",
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                    {h.website && (
                      <a
                        href={h.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        Website ↗
                      </a>
                    )}
                  </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Toggle checked={h.published} onChange={() => togglePublished(h)} label={h.published ? "Shown" : "Hidden"} />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEdit(h)}
                      className="text-ink/60 hover:text-ink text-xs px-2 py-1 rounded border border-line hover:bg-ink/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(h)}
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

      <Modal open={open} title={editingId ? "Edit Hotel" : "Add Hotel"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <ImageUpload label="Cover photo" hint="Optional" value={form.image} onChange={(v) => set("image", v)} />
          <MultiImageUpload
            label="More photos"
            hint="Optional — extra images shown in a gallery on the hotel card"
            value={form.images}
            onChange={(v) => set("images", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Country (EN)">
              <Input value={form.countryEn} onChange={(e) => set("countryEn", e.target.value)} placeholder="Iraq" />
            </Field>
            <Field label="Country (AR)">
              <Input dir="rtl" value={form.countryAr} onChange={(e) => set("countryAr", e.target.value)} placeholder="العراق" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City (EN)">
              <Input value={form.cityEn} onChange={(e) => set("cityEn", e.target.value)} placeholder="Karbala" />
            </Field>
            <Field label="City (AR)">
              <Input dir="rtl" value={form.cityAr} onChange={(e) => set("cityAr", e.target.value)} placeholder="كربلاء" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hotel name (EN)">
              <Input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} />
            </Field>
            <Field label="Hotel name (AR)">
              <Input dir="rtl" value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Address (EN)" hint="Optional">
              <Input value={form.addressEn} onChange={(e) => set("addressEn", e.target.value)} />
            </Field>
            <Field label="Address (AR)" hint="Optional">
              <Input dir="rtl" value={form.addressAr} onChange={(e) => set("addressAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Room types (EN)" hint="Type and press Enter to add, e.g. Single, Double, Suite">
              <ChipsInput
                value={form.roomTypesEn}
                onChange={(v) => set("roomTypesEn", v)}
                placeholder="Single, Double…"
              />
            </Field>
            <Field label="Room types (AR)" hint="اكتب واضغط Enter للإضافة">
              <ChipsInput
                dir="rtl"
                value={form.roomTypesAr}
                onChange={(v) => set("roomTypesAr", v)}
                placeholder="مفرد، مزدوج…"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Starting price (USD)" hint="Optional — shown as “From $X”">
              <Input
                type="number"
                min="0"
                dir="ltr"
                value={form.priceStart}
                onChange={(e) => set("priceStart", e.target.value)}
                placeholder="e.g. 120"
              />
            </Field>
            <div>
              <span className="block text-xs font-medium text-ink/70 mb-1.5">Meals included</span>
              <div className="flex flex-col gap-2 pt-1.5">
                <Toggle checked={form.mealBreakfast} onChange={(v) => set("mealBreakfast", v)} label="Breakfast" />
                <Toggle checked={form.mealLunch} onChange={(v) => set("mealLunch", v)} label="Lunch" />
                <Toggle checked={form.mealDinner} onChange={(v) => set("mealDinner", v)} label="Dinner" />
              </div>
            </div>
          </div>
          <Field label="Website" hint="Optional — link to the hotel's website">
            <Input dir="ltr" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://…" />
          </Field>
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
