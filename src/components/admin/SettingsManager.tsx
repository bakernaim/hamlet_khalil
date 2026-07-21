"use client";

import { useEffect, useState } from "react";
import { Field, Input, Textarea, Button, ErrorText } from "@/components/admin/ui";
import WorkingHoursCard from "@/components/admin/WorkingHoursCard";
import BookingCleanupCard from "@/components/admin/BookingCleanupCard";
import type { SiteSettings } from "@/lib/types";

export default function SettingsManager({ isAdmin }: { isAdmin: boolean }) {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setForm(data))
      .catch(() => setError("Could not load settings"))
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setForm(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return <p className="text-ink/40 text-sm">Loading settings…</p>;
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Site Settings</h1>
        <p className="text-ink/45 text-sm mt-1">Contact info and hero text shown across the site.</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
        <section className="rounded-2xl bg-card border border-line p-5 space-y-4">
          <h2 className="text-ink font-semibold text-sm">Contact</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="WhatsApp number" hint="Country code + number, digits only">
              <Input value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} />
            </Field>
            <Field label="Phone (display)">
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} dir="ltr" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Address (EN)">
              <Textarea rows={2} value={form.addressEn} onChange={(e) => set("addressEn", e.target.value)} />
            </Field>
            <Field label="Address (AR)">
              <Textarea rows={2} dir="rtl" value={form.addressAr} onChange={(e) => set("addressAr", e.target.value)} />
            </Field>
          </div>
          <Field label="Instagram URL" hint="Full profile link used on the site's Instagram buttons">
            <Input value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} dir="ltr" />
          </Field>
        </section>

        <WorkingHoursCard form={form} set={set} />

        <section className="rounded-2xl bg-card border border-line p-5 space-y-4">
          <h2 className="text-ink font-semibold text-sm">Hero section</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Heading (EN)">
              <Textarea rows={2} value={form.heroHeadingEn} onChange={(e) => set("heroHeadingEn", e.target.value)} />
            </Field>
            <Field label="Heading (AR)">
              <Textarea rows={2} dir="rtl" value={form.heroHeadingAr} onChange={(e) => set("heroHeadingAr", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Subheading (EN)">
              <Textarea rows={2} value={form.heroSubheadingEn} onChange={(e) => set("heroSubheadingEn", e.target.value)} />
            </Field>
            <Field label="Subheading (AR)">
              <Textarea rows={2} dir="rtl" value={form.heroSubheadingAr} onChange={(e) => set("heroSubheadingAr", e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl bg-card border border-line p-5 space-y-4">
          <h2 className="text-ink font-semibold text-sm">Appearance</h2>
          <Field
            label="Theme color"
            hint="Accent color used across the site and dashboard (buttons, highlights, dividers). Medium-bright colors work best."
          >
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(form.themeColor) ? form.themeColor : "#00b86a"}
                onChange={(e) => set("themeColor", e.target.value)}
                className="w-10 h-10 rounded-lg border border-line bg-card cursor-pointer p-1"
              />
              <Input
                value={form.themeColor}
                onChange={(e) => set("themeColor", e.target.value)}
                dir="ltr"
                placeholder="#00b86a"
                className="max-w-[140px]"
              />
              <button
                type="button"
                onClick={() => set("themeColor", "#00b86a")}
                className="text-xs text-ink/50 hover:text-ink border border-line rounded-lg px-3 py-2 transition-colors"
              >
                Reset to default
              </button>
            </div>
          </Field>
        </section>

        <ErrorText>{error}</ErrorText>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Settings"}</Button>
          {saved && <span className="text-accent text-sm">✓ Saved</span>}
        </div>
      </form>

      {isAdmin && <div className="max-w-2xl mt-6"><BookingCleanupCard /></div>}
    </div>
  );
}
