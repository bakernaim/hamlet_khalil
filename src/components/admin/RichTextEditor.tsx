"use client";

// Minimal rich-text editor for the bilingual package "info" fields.
// contentEditable + execCommand keeps the bundle free of editor libraries;
// the API sanitizes the HTML on save, so anything exotic pasted in is dropped.

import { useEffect, useRef } from "react";

const TOOLS: { cmd: string; arg?: string; label: string; title: string; className?: string }[] = [
  { cmd: "bold", label: "B", title: "Bold", className: "font-bold" },
  { cmd: "italic", label: "I", title: "Italic", className: "italic" },
  { cmd: "underline", label: "U", title: "Underline", className: "underline" },
  { cmd: "formatBlock", arg: "h3", label: "H", title: "Heading", className: "font-semibold" },
  { cmd: "insertUnorderedList", label: "•≡", title: "Bullet list" },
  { cmd: "insertOrderedList", label: "1≡", title: "Numbered list" },
  { cmd: "formatBlock", arg: "p", label: "¶", title: "Normal paragraph" },
  { cmd: "removeFormat", label: "⌫", title: "Clear formatting" },
];

export default function RichTextEditor({
  value,
  onChange,
  dir = "ltr",
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  dir?: "ltr" | "rtl";
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Only write innerHTML when the prop diverges from the DOM (e.g. opening the
  // modal on another record) — writing on every keystroke would reset the caret.
  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== value) el.innerHTML = value;
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  return (
    <div className="rounded-lg border border-line bg-card focus-within:border-brand/60 focus-within:ring-1 focus-within:ring-brand/40 transition-colors">
      <div className="flex flex-wrap gap-1 px-2 py-1.5 border-b border-line" dir="ltr">
        {TOOLS.map((t) => (
          <button
            key={t.title}
            type="button"
            title={t.title}
            onMouseDown={(e) => e.preventDefault()} // keep the selection in the editor
            onClick={() => exec(t.cmd, t.arg)}
            className={`min-w-7 h-7 px-1.5 rounded text-xs text-ink/60 hover:text-ink hover:bg-ink/8 ${t.className ?? ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        dir={dir}
        data-placeholder={placeholder}
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        onBlur={() => ref.current && onChange(ref.current.innerHTML)}
        className="rich-text min-h-36 max-h-72 overflow-y-auto px-3 py-2 text-sm text-ink outline-none [&:empty::before]:content-[attr(data-placeholder)] [&:empty::before]:text-ink/25"
      />
    </div>
  );
}
