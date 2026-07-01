"use client";

import React from "react";

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
      <span className="block text-xs font-medium text-white/70 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-white/35 mt-1">{hint}</span>}
    </label>
  );
}

const baseInput =
  "w-full rounded-lg bg-[#0b1626] border border-[#1e2b40] text-white text-sm px-3 py-2 outline-none focus:border-[#00b86a]/60 focus:ring-1 focus:ring-[#00b86a]/40 transition-colors placeholder:text-white/25";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${baseInput} ${props.className ?? ""}`} />;
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
      className="inline-flex items-center gap-2 text-sm text-white/70"
    >
      <span
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-[#00b86a]" : "bg-[#1e2b40]"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4.5 left-0.5" : "left-0.5"
          }`}
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
    primary: "bg-[#00b86a] text-[#04121e] hover:bg-[#33d68a] font-semibold",
    ghost: "bg-transparent border border-[#25344c] text-white/75 hover:bg-white/5",
    danger: "bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
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
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-[#0c1524] border border-[#1e2b40] shadow-2xl my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2b40]">
          <h3 className="text-white font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-xl leading-none w-8 h-8 rounded-lg hover:bg-white/5"
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
  return <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2">{children}</p>;
}
