import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Landmark, Plane, CalendarClock, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();

  const [ziyarat, tourism, tripsAll, users, tripsByStatus] = await Promise.all([
    prisma.ziyaratPackage.count(),
    prisma.tourismPackage.count(),
    prisma.currentTrip.count(),
    prisma.user.count(),
    prisma.currentTrip.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const statusCount = (s: string) =>
    tripsByStatus.find((r) => r.status === s)?._count._all ?? 0;

  const cards = [
    { label: "Ziyarat Packages", value: ziyarat, href: "/admin/ziyarat", icon: Landmark, color: "text-ziyarat-red" },
    { label: "Tourism Packages", value: tourism, href: "/admin/tourism", icon: Plane, color: "text-sky-600 dark:text-sky-300" },
    { label: "Current Trips", value: tripsAll, href: "/admin/trips", icon: CalendarClock, color: "text-amber-600 dark:text-amber-300" },
    { label: "Staff Users", value: users, href: "/admin/users", icon: Users, color: "text-violet-600 dark:text-violet-300" },
  ];

  const statuses = [
    { label: "Booking Open", value: statusCount("OPEN"), dot: "bg-brand" },
    { label: "Almost Full", value: statusCount("ALMOST_FULL"), dot: "bg-amber-400" },
    { label: "Departed", value: statusCount("DEPARTED"), dot: "bg-ink/40" },
    { label: "Closed", value: statusCount("CLOSED"), dot: "bg-ink/40" },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-ink">
          Welcome back{session ? `, ${session.name}` : ""} 👋
        </h1>
        <p className="text-ink/45 text-sm mt-1">
          Manage packages, trips, prices and site content from here.
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="rounded-2xl bg-card border border-line p-5 hover:border-brand/40 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} className={c.color} />
                <span className="text-ink/25 group-hover:text-ink/50 transition-colors">→</span>
              </div>
              <div className="text-3xl font-bold text-ink">{c.value}</div>
              <div className="text-ink/45 text-xs mt-1">{c.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Trips by status */}
      <div className="rounded-2xl bg-card border border-line p-5 mb-8">
        <h2 className="text-ink font-semibold mb-4">Current Trips by status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statuses.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
              <div>
                <div className="text-xl font-bold text-ink">{s.value}</div>
                <div className="text-ink/45 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/trips" className="rounded-lg bg-brand text-[#04121e] font-semibold text-sm px-4 py-2.5 hover:bg-brand-hover transition-colors">
          + Add a current trip
        </Link>
        <Link href="/admin/ziyarat" className="rounded-lg border border-line text-ink/75 text-sm px-4 py-2.5 hover:bg-ink/5 transition-colors">
          + Add Ziyarat package
        </Link>
        <Link href="/admin/settings" className="rounded-lg border border-line text-ink/75 text-sm px-4 py-2.5 hover:bg-ink/5 transition-colors">
          Edit site settings
        </Link>
      </div>
    </div>
  );
}
