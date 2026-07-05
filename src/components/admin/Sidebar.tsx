"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Landmark,
  Plane,
  CalendarClock,
  Megaphone,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  KeyRound,
  Ticket,
  Star,
  Images,
} from "lucide-react";
import ThemeToggle from "@/components/site/ThemeToggle";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
  { href: "/admin/ziyarat", label: "Ziyarat Packages", icon: Landmark },
  { href: "/admin/tourism", label: "Tourism Packages", icon: Plane },
  { href: "/admin/trips", label: "Current Trips", icon: CalendarClock },
  { href: "/admin/banners", label: "Banners", icon: Megaphone },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/users", label: "Staff Users", icon: Users },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/account", label: "My Account", icon: KeyRound },
];

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Poll for pending bookings so staff notice new requests without a refresh.
  useEffect(() => {
    let active = true;
    const fetchPending = async () => {
      try {
        const res = await fetch("/api/admin/bookings", { cache: "no-store" });
        if (!res.ok || !active) return;
        const data: { status: string }[] = await res.json();
        setPendingCount(data.filter((b) => b.status === "PENDING").length);
      } catch {
        /* ignore transient errors */
      }
    };
    fetchPending();
    const t = setInterval(fetchPending, 30000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const links = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);
        const badge = item.href === "/admin/bookings" && pendingCount > 0 ? pendingCount : null;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? "bg-brand/15 text-accent font-medium"
                : "text-ink/55 hover:text-ink hover:bg-ink/5"
            }`}
          >
            <Icon size={17} />
            <span className="flex-1">{item.label}</span>
            {badge && (
              <span className="text-[10px] font-bold min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-amber-500 text-[#040d18]">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-line bg-page-alt sticky top-0 z-40">
        <span className="font-bold text-accent">🕌 Admin</span>
        <div className="flex items-center gap-2">
          <ThemeToggle className="w-7 h-7 flex items-center justify-center rounded-full border border-ink/15 text-ink/60 hover:text-ink" />
          <button onClick={() => setOpen((o) => !o)} className="text-ink/70 p-1">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-page-alt border-b border-line p-4">{links}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-page-alt border-r border-line p-4 min-h-screen sticky top-0">
        <div className="px-2 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕌</span>
            <span className="font-bold text-accent">Hamlet Al Khalil</span>
          </div>
          <p className="text-ink/35 text-[11px] mt-1">Admin Dashboard</p>
        </div>

        {links}

        <div className="mt-auto pt-4 border-t border-line space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink/55 hover:text-ink hover:bg-ink/5"
          >
            <ExternalLink size={17} />
            View Website
          </Link>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[11px] text-ink/35">
              Signed in as <span className="text-ink/60">{userName}</span>
            </span>
            <ThemeToggle className="w-7 h-7 flex items-center justify-center rounded-full border border-ink/15 text-ink/60 hover:text-ink transition-colors" />
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600/80 hover:text-red-600 dark:text-red-300/80 dark:hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
