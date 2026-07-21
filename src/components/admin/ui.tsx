"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink/70 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-ink/35 mt-1">{hint}</span>}
    </label>
  );
}

const baseInput =
  "w-full rounded-lg bg-card border border-line text-ink text-sm px-3 py-2 outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/40 transition-colors placeholder:text-ink/25";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

// Tag/chip input: type a value and press Enter or comma to add it as a chip;
// Backspace on an empty input removes the last chip. Stores/returns a string[].
export function ChipsInput({
  value,
  onChange,
  placeholder,
  dir,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
}) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const parts = raw
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    for (const p of parts) if (!next.includes(p)) next.push(p);
    onChange(next);
    setDraft("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      dir={dir}
      className="w-full rounded-lg bg-card border border-line px-2 py-1.5 flex flex-wrap gap-1.5 focus-within:border-brand/60 focus-within:ring-1 focus-within:ring-brand/40 transition-colors"
    >
      {value.map((chip, i) => (
        <span
          key={`${chip}-${i}`}
          className="inline-flex items-center gap-1 rounded-md bg-brand/15 text-ink text-sm px-2 py-1 leading-none"
        >
          {chip}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="text-ink/40 hover:text-ink text-base leading-none"
            aria-label={`Remove ${chip}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => commit(draft)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[6rem] bg-transparent text-ink text-sm px-1 py-1 outline-none placeholder:text-ink/25"
      />
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm text-ink/70"
    >
      <span
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-brand" : "bg-line"
        }`}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
          style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
        />
      </span>
      {label}
    </button>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles: Record<string, string> = {
    primary: "bg-brand text-[#04121e] hover:bg-brand-hover font-semibold",
    ghost: "bg-transparent border border-line text-ink/75 hover:bg-ink/5",
    danger: "bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/20",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
}

// Upload-based image picker: posts the file to /api/admin/upload and stores the
// returned public path in the form. Uses a div (not <label>) so clicks on the
// preview/text don't get forwarded to the buttons.
export function ImageUpload({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Upload failed");
      else onChange(data.path);
    } catch {
      setError("Network error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="block text-xs font-medium text-ink/70 mb-1.5">{label}</span>
      <div className="flex items-center gap-3">
        <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-line bg-card shrink-0">
          {value ? (
            <Image src={value} alt="Preview" fill className="object-cover" sizes="96px" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-ink/25 text-[10px]">
              No image
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
            </Button>
            {value && (
              <Button type="button" variant="danger" onClick={() => onChange("")}>
                Remove
              </Button>
            )}
          </div>
          {value && <span className="text-[11px] text-ink/30 truncate">{value}</span>}
          {error && <span className="text-[11px] text-red-600 dark:text-red-300">{error}</span>}
        </div>
      </div>
      {hint && <span className="block text-[11px] text-ink/35 mt-1">{hint}</span>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={onFile}
      />
    </div>
  );
}

// Multi-image picker: uploads one or more files to /api/admin/upload and stores
// the returned paths in an ordered string[]. Use for a gallery of extra images
// (the cover stays a separate single ImageUpload).
export function MultiImageUpload({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (paths: string[]) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-picking the same files
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    const added: string[] = [];
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) setError(data.error || "Upload failed");
        else added.push(data.path);
      } catch {
        setError("Network error");
      }
    }
    if (added.length) onChange([...value, ...added]);
    setUploading(false);
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <span className="block text-xs font-medium text-ink/70 mb-1.5">{label}</span>
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
          {value.map((src, i) => (
            <div key={`${src}-${i}`} className="relative group aspect-video rounded-lg overflow-hidden border border-line bg-card">
              <Image src={src} alt="" fill className="object-cover" sizes="120px" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/55 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move left"
                  className="text-white/90 text-xs px-1 disabled:opacity-30"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label="Remove image"
                  className="text-red-300 hover:text-red-200 text-xs px-1"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  aria-label="Move right"
                  className="text-white/90 text-xs px-1 disabled:opacity-30"
                >
                  ›
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button type="button" variant="ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? "Uploading…" : "+ Add images"}
      </Button>
      {hint && <span className="block text-[11px] text-ink/35 mt-1">{hint}</span>}
      {error && <span className="block text-[11px] text-red-600 dark:text-red-300 mt-1">{error}</span>}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={onFiles}
      />
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-card border border-line shadow-2xl my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 className="text-ink font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-ink/40 hover:text-ink text-xl leading-none w-8 h-8 rounded-lg hover:bg-ink/5"
          >
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-red-600 dark:text-red-300 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2">{children}</p>;
}
