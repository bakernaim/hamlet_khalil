import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "حملة الخليل | Hamlet Al Khalil",
  description: "وكالة سفر لبنانية متخصصة في الزيارات الدينية والسياحة — Lebanese travel agency specializing in Ziyarat and tourism",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Cairo — body/UI Arabic, Inter — English */}
        {/* Reem Kufi — Arabic headings only */}
        <link
          href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@500;600;700&family=Cairo:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
