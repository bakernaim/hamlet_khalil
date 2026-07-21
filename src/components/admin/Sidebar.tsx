"use client";

import Link from "next/link";
import Image from "next/image";
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
  GalleryHorizontal,
  BedDouble,
  Camera,
  ChevronDown,
  Package,
  PlaneTakeoff,
  type LucideIcon,
} from "lucide-react";
import ThemeToggle from "@/components/site/ThemeToggle";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };
type NavGroup = { id: string; label: string; icon: LucideIcon; items: NavItem[] };

// A single always-visible top link, then collapsible groups.
const DASHBOARD: NavItem = { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true };

const GROUPS: NavGroup[] = [
  {
    id: "bookings",
    label: "Bookings",
    icon: Ticket,
    items: [
      { href: "/admin/bookings", label: "Trip Bookings", icon: Ticket },
      { href: "/admin/hotel-bookings", label: "Hotel Bookings", icon: BedDouble },
      { href: "/admin/flight-bookings", label: "Flight Bookings", icon: PlaneTakeoff },
    ],
  },
  {
    id: "offerings",
    label: "Trips & Packages",
    icon: Package,
    items: [
      { href: "/admin/ziyarat", label: "Ziyarat Packages", icon: Landmark },
      { href: "/admin/tourism", label: "Tourism Packages", icon: Plane },
      { href: "/admin/trips", label: "Current Trips", icon: CalendarClock },
      { href: "/admin/hotels", label: "Hotels", icon: BedDouble },
      { href: "/admin/flights", label: "Flights", icon: PlaneTakeoff },
    ],
  },
  {
    id: "content",
    label: "Content",
    icon: Images,
    items: [
      { href: "/admin/hero-images", label: "Hero Images", icon: GalleryHorizontal },
      { href: "/admin/banners", label: "Banners", icon: Megaphone },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
      { href: "/admin/instagram", label: "Instagram", icon: Camera },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    items: [
      { href: "/admin/users", label: "Staff Users", icon: Users },
      { href: "/admin/settings", label: "Site Settings", icon: Settings },
      { href: "/admin/account", label: "My Account", icon: KeyRound },
    ],
  },
];

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [hotelPendingCount, setHotelPendingCount] = useState(0);
  const [flightPendingCount, setFlightPendingCount] = useState(0);

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
    const fetchHotelPending = async () => {
      try {
        const res = await fetch("/api/admin/hotel-bookings", { cache: "no-store" });
        if (!res.ok || !active) return;
        const data: { status: string }[] = await res.json();
        setHotelPendingCount(data.filter((b) => b.status === "PENDING").length);
      } catch {
        /* ignore transient errors */
      }
    };
    const fetchFlightPending = async () => {
      try {
        const res = await fetch("/api/admin/flight-bookings", { cache: "no-store" });
        if (!res.ok || !active) return;
        const data: { status: string }[] = await res.json();
        setFlightPendingCount(data.filter((b) => b.status === "PENDING").length);
      } catch {
        /* ignore transient errors */
      }
    };
    fetchPending();
    fetchHotelPending();
    fetchFlightPending();
    const t = setInterval(() => {
      fetchPending();
      fetchHotelPending();
      fetchFlightPending();
    }, 30000);
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

  const badgeFor = (href: string) =>
    href === "/admin/bookings"
      ? pendingCount
      : href === "/admin/hotel-bookings"
        ? hotelPendingCount
        : href === "/admin/flight-bookings"
          ? flightPendingCount
          : 0;

  // Which group (if any) contains the current route — used to auto-open it.
  const activeGroupId = GROUPS.find((g) => g.items.some((it) => isActive(it.href, it.exact)))?.id;

  // Explicit per-group open state; `undefined` means "untouched" → defaults to
  // open when it's the active group, so navigating auto-reveals the section.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const groupOpen = (id: string) => openGroups[id] ?? id === activeGroupId;
  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !(prev[id] ?? id === activeGroupId) }));

  const badgeEl = (n: number) => (
    <span className="text-[10px] font-bold min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-amber-500 text-[#040d18]">
      {n}
    </span>
  );

  const leaf = (item: NavItem, nested?: boolean) => {
    const Icon = item.icon;
    const active = isActive(item.href, item.exact);
    const badge = badgeFor(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 rounded-lg transition-colors ${
          nested ? "px-2.5 py-2 text-[13px]" : "px-3 py-2.5 text-sm"
        } ${active ? "bg-brand/15 text-accent font-medium" : "text-ink/55 hover:text-ink hover:bg-ink/5"}`}
      >
        <Icon size={nested ? 16 : 17} />
        <span className="flex-1">{item.label}</span>
        {badge > 0 && badgeEl(badge)}
      </Link>
    );
  };

  const links = (
    <nav className="flex flex-col gap-1">
      {leaf(DASHBOARD)}
      {GROUPS.map((g) => {
        const GIcon = g.icon;
        const isOpen = groupOpen(g.id);
        const hasActive = g.id === activeGroupId;
        const groupBadge = g.items.reduce((sum, it) => sum + badgeFor(it.href), 0);
        return (
          <div key={g.id}>
            <button
              type="button"
              onClick={() => toggleGroup(g.id)}
              aria-expanded={isOpen}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                hasActive && !isOpen ? "text-accent" : "text-ink/55 hover:text-ink hover:bg-ink/5"
              }`}
            >
              <GIcon size={17} />
              <span className="flex-1 text-start">{g.label}</span>
              {groupBadge > 0 && !isOpen && badgeEl(groupBadge)}
              <ChevronDown size={15} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="mt-1 ms-4 ps-2 border-s border-line flex flex-col gap-1">
                {g.items.map((item) => leaf(item, true))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-line bg-page-alt sticky top-0 z-40">
        <span className="flex items-center gap-2 font-bold text-accent">
          <span className="relative w-6 h-6 rounded-md overflow-hidden bg-white border border-brand/25 shrink-0">
            <Image src="/logo.png" alt="Logo" fill className="object-contain p-0.5" sizes="24px" />
          </span>
          Admin
        </span>
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

      {/* Desktop sidebar — fixed to the viewport height; only the nav list scrolls
          internally if it overflows, so the header and sign-out footer stay visible. */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-page-alt border-r border-line p-4 h-screen sticky top-0">
        <div className="px-2 py-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative w-8 h-8 rounded-lg overflow-hidden bg-white border border-brand/25 shrink-0">
              <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" sizes="32px" />
            </span>
            <span className="font-bold text-accent">Hamlet Al Khalil</span>
          </div>
          <p className="text-ink/35 text-[11px] mt-1">Admin Dashboard</p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">{links}</div>

        <div className="shrink-0 pt-4 border-t border-line space-y-1">
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
