import { prisma } from "@/lib/prisma";
import { parseList } from "@/lib/serialize";
import { buildSettings } from "@/lib/settings";
import { computeDepartures } from "@/lib/recurrence";
import type {
  ZiyaratPackageDTO,
  TourismPackageDTO,
  CurrentTripDTO,
  BannerDTO,
  ReviewDTO,
  GalleryItemDTO,
  HeroImageDTO,
  HotelDTO,
  InstagramPostDTO,
  SiteSettings,
  TripStatus,
  TripFrequency,
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
    badgeAr: p.badgeAr,
    badgeEn: p.badgeEn,
    highlightsAr: parseList(p.highlightsAr),
    highlightsEn: parseList(p.highlightsEn),
    infoAr: p.infoAr,
    infoEn: p.infoEn,
    image: p.image,
    images: parseList(p.images),
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
    descAr: p.descAr,
    descEn: p.descEn,
    infoAr: p.infoAr,
    infoEn: p.infoEn,
    image: p.image,
    images: parseList(p.images),
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
    frequency: t.frequency as TripFrequency,
    recurEndDate: t.recurEndDate ? t.recurEndDate.toISOString() : null,
    departures: computeDepartures(t.departureDate, t.frequency, t.recurEndDate).map((d) =>
      d.toISOString()
    ),
    price: t.price,
    seatsLeft: t.seatsLeft,
    status: t.status as TripStatus,
    image: t.image,
    images: parseList(t.images),
    packageType: t.packageType,
    packageSlug: t.packageSlug,
  }));
}

export async function getBanners(publishedOnly = true): Promise<BannerDTO[]> {
  const rows = await prisma.banner.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((b) => ({
    id: b.id,
    titleAr: b.titleAr,
    titleEn: b.titleEn,
    badgeAr: b.badgeAr,
    badgeEn: b.badgeEn,
    textAr: b.textAr,
    textEn: b.textEn,
    image: b.image,
    theme: b.theme,
    displayMode: b.displayMode,
    targetDate: b.targetDate ? b.targetDate.toISOString() : null,
    priceFrom: b.priceFrom,
    noteAr: b.noteAr,
    noteEn: b.noteEn,
    ctaAr: b.ctaAr,
    ctaEn: b.ctaEn,
  }));
}

// Approved reviews, newest first, for the public reviews section.
export async function getApprovedReviews(): Promise<ReviewDTO[]> {
  const rows = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    tripLabel: r.tripLabel,
    rating: r.rating,
    text: r.text,
    createdAt: r.createdAt.toISOString(),
  }));
}

// Published gallery media for the public gallery section.
export async function getGalleryItems(): Promise<GalleryItemDTO[]> {
  const rows = await prisma.galleryItem.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((g) => ({
    id: g.id,
    type: g.type,
    src: g.src,
    captionAr: g.captionAr,
    captionEn: g.captionEn,
  }));
}

// Published Instagram posts, in display order, for the homepage feed grid.
export async function getInstagramPosts(): Promise<InstagramPostDTO[]> {
  const rows = await prisma.instagramPost.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((p) => ({
    id: p.id,
    image: p.image,
    permalink: p.permalink,
    captionAr: p.captionAr,
    captionEn: p.captionEn,
  }));
}

// Published hero images, in display order, for the homepage background carousel.
export async function getHeroImages(): Promise<HeroImageDTO[]> {
  const rows = await prisma.heroImage.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((h) => ({ id: h.id, src: h.src }));
}

// Published hotels for the public "help you book your hotel" section.
export async function getHotels(publishedOnly = true): Promise<HotelDTO[]> {
  const rows = await prisma.hotel.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((h) => ({
    id: h.id,
    countryAr: h.countryAr,
    countryEn: h.countryEn,
    cityAr: h.cityAr,
    cityEn: h.cityEn,
    nameAr: h.nameAr,
    nameEn: h.nameEn,
    addressAr: h.addressAr,
    addressEn: h.addressEn,
    image: h.image,
    images: parseList(h.images),
    roomTypesAr: parseList(h.roomTypesAr),
    roomTypesEn: parseList(h.roomTypesEn),
    priceStart: h.priceStart,
    mealBreakfast: h.mealBreakfast,
    mealLunch: h.mealLunch,
    mealDinner: h.mealDinner,
    website: h.website,
  }));
}

export async function getSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany();
  return buildSettings(rows);
}
