import { prisma } from "@/lib/prisma";
import { parseList } from "@/lib/serialize";
import { buildSettings } from "@/lib/settings";
import type {
  ZiyaratPackageDTO,
  TourismPackageDTO,
  CurrentTripDTO,
  SiteSettings,
  TripStatus,
} from "@/lib/types";

export async function getZiyaratPackages(publishedOnly = true): Promise<ZiyaratPackageDTO[]> {
  const rows = await prisma.ziyaratPackage.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    flag: p.flag,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    durationAr: p.durationAr,
    durationEn: p.durationEn,
    price: p.price,
    badgeAr: p.badgeAr,
    badgeEn: p.badgeEn,
    highlightsAr: parseList(p.highlightsAr),
    highlightsEn: parseList(p.highlightsEn),
    image: p.image,
    color: p.color,
  }));
}

export async function getTourismPackages(publishedOnly = true): Promise<TourismPackageDTO[]> {
  const rows = await prisma.tourismPackage.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    flag: p.flag,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    durationAr: p.durationAr,
    durationEn: p.durationEn,
    price: p.price,
    descAr: p.descAr,
    descEn: p.descEn,
    image: p.image,
  }));
}

export async function getCurrentTrips(publishedOnly = true): Promise<CurrentTripDTO[]> {
  const rows = await prisma.currentTrip.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { departureDate: "asc" }],
  });
  return rows.map((t) => ({
    id: t.id,
    titleAr: t.titleAr,
    titleEn: t.titleEn,
    destinationAr: t.destinationAr,
    destinationEn: t.destinationEn,
    departureDate: t.departureDate.toISOString(),
    returnDate: t.returnDate ? t.returnDate.toISOString() : null,
    price: t.price,
    seatsLeft: t.seatsLeft,
    status: t.status as TripStatus,
    image: t.image,
    packageType: t.packageType,
    packageSlug: t.packageSlug,
  }));
}

export async function getSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany();
  return buildSettings(rows);
}
