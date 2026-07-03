import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { getSettings } from "@/server/data";
import { buildThemeCss, isValidHex } from "@/lib/color";
import { SETTING_DEFAULTS } from "@/lib/settings";

export const metadata: Metadata = {
  title: "حملة الخليل | Hamlet Al Khalil",
  description: "وكالة سفر لبنانية متخصصة في الزيارات الدينية والسياحة — Lebanese travel agency specializing in Ziyarat and tourism",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Accent color is editable from the admin dashboard (Site Settings).
  const { themeColor } = await getSettings();
  const accent = isValidHex(themeColor) ? themeColor : SETTING_DEFAULTS.themeColor;
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Apply the theme before paint: saved choice wins, else device preference. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Cairo — body/UI Arabic, Inter — English */}
        {/* Reem Kufi — Arabic headings only, Amiri — Quranic calligraphy */}
        <link
          href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@500;600;700&family=Cairo:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Accent shades derived from the dashboard themeColor setting. */}
        <style dangerouslySetInnerHTML={{ __html: buildThemeCss(accent) }} />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
