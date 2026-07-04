import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Hamlet Al Khalil",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="ltr" className="min-h-screen bg-page text-ink antialiased">
      {children}
    </div>
  );
}
