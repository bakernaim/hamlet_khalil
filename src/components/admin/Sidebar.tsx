"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/ziyarat", label: "Ziyarat Packages", icon: Landmark },
  { href: "/admin/tourism", label: "Tourism Packages", icon: Plane },
  { href: "/admin/trips", label: "Current Trips", icon: CalendarClock },
  { href: "/admin/banners", label: "Banners", icon: Megaphone },
  { href: "/admin/users", label: "Staff Users", icon: Users },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? "bg-[#00b86a]/15 text-[#33d68a] font-medium"
                : "text-white/55 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={17} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-[#1a2740] bg-[#0a1220] sticky top-0 z-40">
        <span className="font-bold text-[#00b86a]">🕌 Admin</span>
        <button onClick={() => setOpen((o) => !o)} className="text-white/70 p-1">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-[#0a1220] border-b border-[#1a2740] p-4">{links}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#0a1220] border-r border-[#1a2740] p-4 min-h-screen sticky top-0">
        <div className="px-2 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕌</span>
            <span className="font-bold text-[#00b86a]">Hamlet Al Khalil</span>
          </div>
          <p className="text-white/35 text-[11px] mt-1">Admin Dashboard</p>
        </div>

        {links}

        <div className="mt-auto pt-4 border-t border-[#1a2740] space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/55 hover:text-white hover:bg-white/5"
          >
            <ExternalLink size={17} />
            View Website
          </Link>
          <div className="px-3 py-2 text-[11px] text-white/35">
            Signed in as <span className="text-white/60">{userName}</span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-300/80 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
