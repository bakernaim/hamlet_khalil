"use client";

import { useId } from "react";

export const PAGE_SIZES = [10, 20, 50] as const;

// A labelled dropdown whose options come only from values in the data. An empty
// value ("") means "no filter" and renders as the `allLabel` option.
export function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel: string;
}) {
  return (
    <label className="flex-1 min-w-[8.5rem]">
      <span className="block text-[11px] font-medium text-muted mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-card border border-line text-ink text-sm px-3 py-2.5 outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/25 transition"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

// Search input with a native datalist of suggestions drawn from the data, so
// the dropdown only ever offers values that exist in the database.
export function SearchBox({
  value,
  onChange,
  suggestions,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder: string;
}) {
  const id = useId();
  return (
    <div className="relative">
      <span className="absolute inset-y-0 start-3.5 flex items-center text-muted/60 pointer-events-none">🔍</span>
      <input
        list={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full bg-card border border-line text-ink text-sm ps-10 pe-10 py-3 outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/25 transition placeholder:text-muted/50"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear"
          className="absolute inset-y-0 end-3 flex items-center text-muted/60 hover:text-ink text-lg"
        >
          ×
        </button>
      )}
      <datalist id={id}>
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
}

// Page-size selector + prev/next controls. Bilingual via `isRTL`.
export function Pager({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
  isRTL,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
  onPageSize: (n: number) => void;
  isRTL: boolean;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-6 text-sm text-soft">
      <label className="flex items-center gap-2">
        <span>{isRTL ? "لكل صفحة" : "Per page"}</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="rounded-lg bg-card border border-line text-ink text-sm px-2 py-1.5 outline-none focus:border-brand/60"
        >
          {PAGE_SIZES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-lg border border-line text-ink/70 hover:bg-ink/5 disabled:opacity-40"
          >
            {isRTL ? "‹ السابق" : "‹ Prev"}
          </button>
          <span className="text-muted text-xs">
            {isRTL ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
          </span>
          <button
            type="button"
            onClick={() => onPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-lg border border-line text-ink/70 hover:bg-ink/5 disabled:opacity-40"
          >
            {isRTL ? "التالي ›" : "Next ›"}
          </button>
        </div>
      )}
    </div>
  );
}
