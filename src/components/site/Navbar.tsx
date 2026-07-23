"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { nav } from "@/data/content";
import { waHref } from "@/lib/whatsapp";
import ThemeToggle from "@/components/site/ThemeToggle";

export default function Navbar({ whatsappNumber }: { whatsappNumber: string }) {
  const { lang, toggleLang, isRTL } = useLang();
  const WHATSAPP_URL = waHref(whatsappNumber);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hijriDate, setHijriDate] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hijri date via the built-in Umm al-Qura calendar; set in an effect so the
  // server render (which may sit in another timezone) never mismatches.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only date, runs once per language
    setHijriDate(
      new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-islamic-umalqura" : "en-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date())
    );
  }, [lang]);

  return (
    <nav
      dir={isRTL ? "rtl" : "ltr"}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-page/95 backdrop-blur-lg border-b border-line shadow-lg shadow-black/5 dark:shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ── */}
          <a href="#home" className="group flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-brand/30 bg-white group-hover:border-brand/60 group-hover:shadow-md group-hover:shadow-brand/20 transition-all shrink-0">
              <Image
                src="/logo.png"
                alt="حملة الخليل"
                fill
                className="object-contain p-1"
                sizes="40px"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`text-base lg:text-lg font-bold ${scrolled ? "shimmer-text" : "shimmer-text-light"}`}>
                {isRTL ? nav.logo.ar : nav.logo.en}
              </span>
              <span className={`text-[9px] lg:text-[10px] tracking-[0.2em] uppercase ${scrolled ? "text-muted/80" : "text-white/35"}`}>
                {isRTL ? "Hamlet Al Khalil" : "حملة الخليل"}
              </span>
            </div>
          </a>

          {/* ── Desktop links ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm transition-colors font-medium px-3 py-2 rounded-lg hover:bg-brand/6 group ${
                  scrolled ? "text-muted hover:text-accent" : "text-white/60 hover:text-brand-hover"
                }`}
              >
                {isRTL ? link.ar : link.en}
                <span className="absolute bottom-1.5 start-1/2 -translate-x-1/2 w-0 h-px bg-brand group-hover:w-4 transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* ── Right controls ── */}
          <div className="hidden lg:flex items-center gap-3">
            {hijriDate && (
              <span className={`hidden xl:inline-flex items-center gap-1.5 text-[11px] rounded-full px-3 py-1.5 border ${
                scrolled ? "text-muted border-ink/10 bg-ink/4" : "text-white/45 border-white/10 bg-white/4"
              }`}>
                <span className="text-brand/80">☾</span>
                {hijriDate}
              </span>
            )}
            <ThemeToggle
              className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all hover:border-brand/60 hover:bg-brand/8 ${
                scrolled
                  ? "border-ink/15 text-muted hover:text-accent"
                  : "border-white/15 text-white/60 hover:text-white"
              }`}
            />
            <button
              onClick={toggleLang}
              className={`text-xs font-bold px-4 py-2 rounded-full border transition-all hover:border-brand/60 hover:bg-brand/8 ${
                scrolled
                  ? "border-accent/35 text-accent/90 hover:text-accent"
                  : "border-brand/30 text-brand/80 hover:text-brand"
              }`}
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-green-600/25"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {isRTL ? "تواصل معنا" : "Contact Us"}
            </a>
          </div>

          {/* ── Mobile ── */}
          <div className="flex lg:hidden items-center gap-2.5">
            <ThemeToggle
              className={`w-7 h-7 flex items-center justify-center rounded-full border ${
                scrolled ? "border-ink/15 text-muted" : "border-white/20 text-white/70"
              }`}
            />
            <button
              onClick={toggleLang}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                scrolled ? "border-accent/40 text-accent" : "border-brand/35 text-brand"
              }`}
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className={`p-1 ${scrolled ? "text-ink/70 hover:text-ink" : "text-white/70 hover:text-white"}`}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } bg-page/98 backdrop-blur-xl border-t border-line shadow-xl shadow-black/8 dark:shadow-black/40`}
      >
        <div className="px-5 py-5 flex flex-col gap-1" dir={isRTL ? "rtl" : "ltr"}>
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-soft hover:text-accent transition-colors py-3 px-3 rounded-lg hover:bg-brand/6 text-sm border-b border-ink/6 last:border-0"
            >
              {isRTL ? link.ar : link.en}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-green-700 to-green-600 text-white text-sm font-bold py-3.5 rounded-full"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {isRTL ? "تواصل عبر واتساب" : "Contact via WhatsApp"}
          </a>
        </div>
      </div>
    </nav>
  );
}
