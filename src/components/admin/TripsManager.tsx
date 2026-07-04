"use client";

import { useState } from "react";
import { useResource } from "@/components/admin/useResource";
import { Field, Input, Select, Button, Modal, Toggle, ErrorText, ImageUpload } from "@/components/admin/ui";

interface Trip {
  id: string;
  titleAr: string;
  titleEn: string;
  destinationAr: string;
  destinationEn: string;
  departureDate: string;
  returnDate: string | null;
  price: number;
  seatsLeft: number | null;
  status: string;
  image: string | null;
  packageType: string | null;
  packageSlug: string | null;
  sortOrder: number;
  published: boolean;
}

type FormState = {
  titleAr: string;
  titleEn: string;
  destinationAr: string;
  destinationEn: string;
  departureDate: string;
  returnDate: string;
  price: string;
  seatsLeft: string;
  status: string;
  image: string;
  packageType: string;
  packageSlug: string;
  sortOrder: string;
  published: boolean;
};

const empty: FormState = {
  titleAr: "",
  titleEn: "",
  destinationAr: "",
  destinationEn: "",
  departureDate: "",
  returnDate: "",
  price: "0",
  seatsLeft: "",
  status: "OPEN",
  image: "",
  packageType: "",
  packageSlug: "",
  sortOrder: "0",
  published: true,
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Booking Open",
  ALMOST_FULL: "Almost Full",
  DEPARTED: "Departed",
  CLOSED: "Closed",
};

const isoToInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

function toForm(t: Trip): FormState {
  return {
    titleAr: t.titleAr,
    titleEn: t.titleEn,
    destinationAr: t.destinationAr,
    destinationEn: t.destinationEn,
    departureDate: isoToInput(t.departureDate),
    returnDate: isoToInput(t.returnDate),
    price: String(t.price),
    seatsLeft: t.seatsLeft == null ? "" : String(t.seatsLeft),
    status: t.status,
    image: t.image ?? "",
    packageType: t.packageType ?? "",
    packageSlug: t.packageSlug ?? "",
    sortOrder: String(t.sortOrder),
    published: t.published,
  };
}

export default function TripsManager() {
  const { items, loading, error, save, remove } = useResource<Trip>("/api/admin/trips");
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
  function openEdit(t: Trip) {
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
      {
        ...form,
        price: Number(form.price),
        sortOrder: Number(form.sortOrder),
      },
      editingId ?? undefined
    );
    setSaving(false);
    if (!res.ok) setFormError(res.error || "Save failed");
    else setOpen(false);
  }

  async function onDelete(t: Trip) {
    if (!confirm(`Delete "${t.titleEn || t.titleAr}"? This cannot be undone.`)) return;
    const res = await remove(t.id);
    if (!res.ok) alert(res.error);
  }

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Current Trips</h1>
          <p className="text-ink/45 text-sm mt-1">Upcoming departures with live availability.</p>
        </div>
        <Button onClick={openNew}>+ New Trip</Button>
      </header>

      <ErrorText>{error}</ErrorText>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-ink/40 text-sm">No trips yet. Add your first departure.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-page-alt text-ink/50 text-left text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Trip</th>
                <th className="px-4 py-3 font-medium">Departs</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Seats</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16223a]">
              {items.map((t) => (
                <tr key={t.id} className="hover:bg-ink/[0.02]">
                  <td className="px-4 py-3">
                    <div className="text-ink font-medium">{t.titleEn}</div>
                    <div className="text-ink/40 text-xs">{t.destinationEn}{!t.published && " · hidden"}</div>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{fmt(t.departureDate)}</td>
                  <td className="px-4 py-3 text-accent font-semibold">${t.price}</td>
                  <td className="px-4 py-3 text-ink/60">{t.seatsLeft ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-ink/8 text-ink/70">
                      {STATUS_LABEL[t.status] ?? t.status}
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

      <Modal open={open} title={editingId ? "Edit Trip" : "New Trip"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title (English)">
              <Input value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} />
            </Field>
            <Field label="Title (Arabic)">
              <Input dir="rtl" value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Destination (EN)" hint="e.g. Iraq">
              <Input value={form.destinationEn} onChange={(e) => set("destinationEn", e.target.value)} />
            </Field>
            <Field label="Destination (AR)">
              <Input dir="rtl" value={form.destinationAr} onChange={(e) => set("destinationAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Departure date">
              <Input type="date" value={form.departureDate} onChange={(e) => set("departureDate", e.target.value)} required />
            </Field>
            <Field label="Return date" hint="Optional">
              <Input type="date" value={form.returnDate} onChange={(e) => set("returnDate", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (USD)">
              <Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </Field>
            <Field label="Seats left" hint="Optional">
              <Input type="number" value={form.seatsLeft} onChange={(e) => set("seatsLeft", e.target.value)} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
                {Object.entries(STATUS_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Linked package type" hint="Optional">
              <Select value={form.packageType} onChange={(e) => set("packageType", e.target.value)}>
                <option value="">None</option>
                <option value="ziyarat">Ziyarat</option>
                <option value="tourism">Tourism</option>
              </Select>
            </Field>
            <Field label="Linked package slug" hint="e.g. iraq">
              <Input value={form.packageSlug} onChange={(e) => set("packageSlug", e.target.value)} />
            </Field>
            <Field label="Sort order">
              <Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
            </Field>
          </div>
          <ImageUpload
            label="Image"
            hint="Optional — shown on the trip card"
            value={form.image}
            onChange={(p) => set("image", p)}
          />
          <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published (visible on site)" />

          <ErrorText>{formError}</ErrorText>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Trip"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
