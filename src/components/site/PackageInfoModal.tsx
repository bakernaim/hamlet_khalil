"use client";

// Full-info dialog for a package: renders the admin-authored rich text.

import { useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

export default function PackageInfoModal({
  open,
  onClose,
  title,
  flag,
  duration,
  image,
  html,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  flag: string;
  duration: string;
  image: string;
  html: string;
}) {
  const { isRTL } = useLang();

  // Close on Escape + lock page scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center p-4 sm:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-card border border-line shadow-2xl my-4 overflow-hidden">
        {/* Header photo */}
        <div className="relative h-40 sm:h-48">
          <Image src={image} alt={title} fill className="object-cover" sizes="(max-width:672px) 100vw, 672px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <button
            onClick={onClose}
            aria-label={isRTL ? "إغلاق" : "Close"}
            className="absolute top-3 end-3 w-9 h-9 rounded-full bg-black/50 text-white/90 hover:bg-black/70 text-xl leading-none backdrop-blur-sm"
          >
            ×
          </button>
          <div className="absolute bottom-3 inset-x-4 flex items-end justify-between gap-3">
            <div>
              <div className="text-2xl mb-1">{flag}</div>
              <h3 className="text-white font-bold text-lg leading-snug drop-shadow">{title}</h3>
            </div>
            <span className="bg-black/55 text-white/85 text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm shrink-0">
              {duration}
            </span>
          </div>
        </div>

        {/* Rich text body */}
        <div
          className="rich-text max-h-[55vh] overflow-y-auto px-5 sm:px-6 py-5 text-soft text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
