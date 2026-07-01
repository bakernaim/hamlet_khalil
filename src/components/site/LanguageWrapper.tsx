"use client";

import { useLang } from "@/context/LanguageContext";
import { useEffect } from "react";

export default function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { lang, isRTL } = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [lang, isRTL]);

  return <>{children}</>;
}
