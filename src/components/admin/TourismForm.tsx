"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, Input, Textarea, Button, Toggle, ErrorText, ImageUpload, MultiImageUpload } from "@/components/admin/ui";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { parseList } from "@/lib/serialize";

interface Tourism {
  id: string;
  slug: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  descAr: string;
  descEn: string;
  infoAr: string;
  infoEn: string;
  image: string;
  images: string; // JSON string from the raw row
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
  descAr: string;
  descEn: string;
  infoAr: string;
  infoEn: string;
  image: string;
  images: string[];
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
  descAr: "",
  descEn: "",
  infoAr: "",
  infoEn: "",
  image: "/shrines/turkey-istanbul.jpg",
  images: [],
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
    descAr: t.descAr,
    descEn: t.descEn,
    infoAr: t.infoAr,
    infoEn: t.infoEn,
    image: t.image,
    images: parseList(t.images),
    sortOrder: String(t.sortOrder),
    published: t.published,
  };
}

export default function TourismForm({ id }: { id?: string }) {
  const router = useRouter();
  const editing = Boolean(id);
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(editing);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      const res = await fetch(`/api/admin/tourism/${id}`, { cache: "no-store" });
      if (!active) return;
      if (!res.ok) {
        setFormError("Could not load this package");
        setLoading(false);
        return;
      }
      setForm(toForm(await res.json()));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const res = await fetch(id ? `/api/admin/tourism/${id}` : "/api/admin/tourism", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setFormError(data.error || "Save failed");
      return;
    }
    router.push("/admin/tourism");
    router.refresh();
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-5.5rem)] sm:h-[calc(100dvh-6.5rem)] lg:h-[calc(100dvh-4rem)]">
      <header className="shrink-0 mb-4">
        <Link href="/admin/tourism" className="text-ink/45 hover:text-ink text-sm inline-flex items-center gap-1 mb-3">
          ← Back to Tourism Packages
        </Link>
        <h1 className="text-2xl font-bold text-ink">{editing ? "Edit Package" : "New Package"}</h1>
        <p className="text-ink/45 text-sm mt-1">Leisure travel package shown on the homepage.</p>
      </header>

      {loading ? (
        <p className="text-ink/40 text-sm">Loading…</p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 max-w-3xl">
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
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration (EN)" hint="e.g. 7 Days">
              <Input value={form.durationEn} onChange={(e) => set("durationEn", e.target.value)} />
            </Field>
            <Field label="Duration (AR)">
              <Input dir="rtl" value={form.durationAr} onChange={(e) => set("durationAr", e.target.value)} />
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
          <Field label="Info / details (EN)" hint="Shown in the “Details” view on the site — visitors can also listen to it">
            <RichTextEditor
              value={form.infoEn}
              onChange={(html) => set("infoEn", html)}
              placeholder="Full information about this trip: itinerary, what's included, tips…"
            />
          </Field>
          <Field label="Info / details (AR)" hint="يظهر في نافذة «التفاصيل» على الموقع مع إمكانية الاستماع">
            <RichTextEditor
              dir="rtl"
              value={form.infoAr}
              onChange={(html) => set("infoAr", html)}
              placeholder="معلومات كاملة عن هذه الرحلة: البرنامج، ما تشمله الباقة، نصائح…"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload
              label="Cover image"
              hint="Shown on the package card"
              value={form.image}
              onChange={(p) => set("image", p)}
            />
            <Field label="Sort order" hint="Lower shows first">
              <Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
            </Field>
          </div>
          <MultiImageUpload
            label="More images"
            hint="Optional — extra photos shown in a gallery on the package details"
            value={form.images}
            onChange={(v) => set("images", v)}
          />
          <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published (visible on site)" />

            <ErrorText>{formError}</ErrorText>
          </div>
          <div className="shrink-0 flex justify-end gap-2 pt-3 mt-3 border-t border-line max-w-3xl">
            <Link
              href="/admin/tourism"
              className="inline-flex items-center justify-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-colors bg-transparent border border-line text-ink/75 hover:bg-ink/5"
            >
              Cancel
            </Link>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Package"}</Button>
          </div>
        </form>
      )}
    </div>
  );
}
