// Plain serializable DTOs passed from server components to client components.
// Bilingual values are flat `...Ar` / `...En` pairs; list fields are real arrays.

export type Locale = "ar" | "en";

export interface ZiyaratPackageDTO {
  id: string;
  slug: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  badgeAr: string | null;
  badgeEn: string | null;
  highlightsAr: string[];
  highlightsEn: string[];
  infoAr: string; // rich-text HTML
  infoEn: string; // rich-text HTML
  image: string;
  color: string;
}

export interface TourismPackageDTO {
  id: string;
  slug: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  durationAr: string;
  durationEn: string;
  descAr: string;
  descEn: string;
  infoAr: string; // rich-text HTML
  infoEn: string; // rich-text HTML
  image: string;
}

export type TripStatus = "OPEN" | "ALMOST_FULL" | "DEPARTED" | "CLOSED";

export type TripFrequency = "ONCE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

export interface CurrentTripDTO {
  id: string;
  titleAr: string;
  titleEn: string;
  destinationAr: string;
  destinationEn: string;
  departureDate: string; // ISO — first/only departure
  returnDate: string | null; // ISO
  frequency: TripFrequency;
  recurEndDate: string | null; // ISO
  departures: string[]; // upcoming bookable departure dates (ISO), future-only
  price: number;
  seatsLeft: number | null;
  status: TripStatus;
  image: string | null;
  packageType: string | null;
  packageSlug: string | null;
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface BookingDTO {
  id: string;
  tripId: string | null;
  tripTitleAr: string;
  tripTitleEn: string;
  departureDate: string; // ISO
  fullName: string;
  phone: string;
  partySize: number;
  passports: string[]; // private file tokens; view via /api/admin/passport/<token>
  notes: string | null;
  status: BookingStatus;
  createdAt: string; // ISO
}

export interface BannerDTO {
  id: string;
  titleAr: string;
  titleEn: string;
  badgeAr: string | null;
  badgeEn: string | null;
  textAr: string;
  textEn: string;
  image: string | null;
  theme: string; // "green" | "amber"
  targetDate: string | null; // ISO — countdown when in the future
  priceFrom: number | null;
  noteAr: string | null;
  noteEn: string | null;
  ctaAr: string | null;
  ctaEn: string | null;
}

export interface SiteSettings {
  whatsappNumber: string;
  heroHeadingAr: string;
  heroHeadingEn: string;
  heroSubheadingAr: string;
  heroSubheadingEn: string;
  phone: string;
  addressAr: string;
  addressEn: string;
  instagramUrl: string;
  themeColor: string; // brand accent hex, e.g. "#00b86a"
}
