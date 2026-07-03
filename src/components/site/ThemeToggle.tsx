"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Light/dark switch. The initial theme is applied before paint by the inline
// script in app/layout.tsx (localStorage "theme", else the device preference);
// this component just reflects and toggles the html.dark class.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  // null until mounted — the server can't know the theme.
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- theme is client-only, read once on mount
    setDark(document.documentElement.classList.contains("dark"));

    // Follow device theme changes until the user picks one explicitly.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return;
      document.documentElement.classList.toggle("dark", e.matches);
      setDark(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = !(dark ?? document.documentElement.classList.contains("dark"));
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={className}
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
