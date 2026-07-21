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
  image: string; // cover image
  images: string[]; // extra gallery images (cover excluded)
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
  image: string; // cover image
  images: string[]; // extra gallery images (cover excluded)
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
  image: string | null; // cover image
  images: string[]; // extra gallery images (cover excluded)
  packageType: string | null;
  packageSlug: string | null;
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

// Hotel room preference chosen while booking (beds per room).
export const ROOM_TYPES = ["SINGLE", "DOUBLE", "TRIPLE", "QUAD"] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export interface BookingDTO {
  id: string;
  tripId: string | null;
  tripTitleAr: string;
  tripTitleEn: string;
  departureDate: string; // ISO
  fullName: string;
  phone: string;
  partySize: number;
  roomType: RoomType | null; // null on bookings made before room selection existed
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
  displayMode: string; // "bar" (thin bottom bar) | "modal" (popup on page load) | "both"
  targetDate: string | null; // ISO — countdown when in the future
  priceFrom: number | null;
  noteAr: string | null;
  noteEn: string | null;
  ctaAr: string | null;
  ctaEn: string | null;
}

// A visitor-submitted review (single language — shown as written).
export interface ReviewDTO {
  id: string;
  name: string;
  tripLabel: string | null;
  rating: number; // 1–5
  text: string;
  createdAt: string; // ISO
}

// Admin view of a review adds the moderation flag.
export interface AdminReviewDTO extends ReviewDTO {
  approved: boolean;
}

export interface GalleryItemDTO {
  id: string;
  type: string; // "image" | "video"
  src: string; // /api/media/… path
  captionAr: string | null;
  captionEn: string | null;
}

export interface HeroImageDTO {
  id: string;
  src: string; // /api/media/… path
}

// A hotel we can help a customer book (admin-managed, shown on the public
// "help you book your hotel" section).
export interface HotelDTO {
  id: string;
  countryAr: string;
  countryEn: string;
  cityAr: string;
  cityEn: string;
  nameAr: string;
  nameEn: string;
  addressAr: string | null;
  addressEn: string | null;
  image: string | null; // /api/media/… path, optional (cover image)
  images: string[]; // extra gallery images (cover excluded)
  roomTypesAr: string[];
  roomTypesEn: string[];
  priceStart: number | null; // starting price in USD, shown as "From $X"
  mealBreakfast: boolean;
  mealLunch: boolean;
  mealDinner: boolean;
  website: string | null;
}

export interface FlightDTO {
  id: string;
  fromAr: string;
  fromEn: string;
  toAr: string;
  toEn: string;
  airlineAr: string;
  airlineEn: string;
  mealIncluded: boolean;
  price: number; // USD
  image: string | null;
}

export type FlightBookingStatus = "PENDING" | "CONTACTED" | "CLOSED";

export interface FlightBookingRequestDTO {
  id: string;
  flightId: string | null;
  fromAr: string;
  fromEn: string;
  toAr: string;
  toEn: string;
  airlineAr: string;
  airlineEn: string;
  fullName: string;
  phone: string;
  travelDate: string; // ISO
  passengers: number;
  passports: string[]; // private file tokens; view via /api/admin/passport/<token>
  status: FlightBookingStatus;
  createdAt: string; // ISO
}

// Fallback room types for hotels that have no custom room types defined.
// When a hotel defines its own roomTypes, the booking uses those strings instead.
export const HOTEL_ROOM_TYPES = ["SINGLE", "DOUBLE", "TRIPLE", "SUITE"] as const;
export type HotelRoomType = (typeof HOTEL_ROOM_TYPES)[number];

// Meals a visitor can request with a hotel booking (only those the hotel offers).
export const HOTEL_MEALS = ["BREAKFAST", "LUNCH", "DINNER"] as const;
export type HotelMeal = (typeof HOTEL_MEALS)[number];

export type HotelBookingStatus = "PENDING" | "CONTACTED" | "CLOSED";

export interface HotelBookingRequestDTO {
  id: string;
  hotelId: string | null;
  hotelNameAr: string;
  hotelNameEn: string;
  fullName: string;
  phone: string;
  rooms: string[]; // hotel-defined room type per room (falls back to HOTEL_ROOM_TYPES)
  meals: HotelMeal[]; // requested meals
  checkIn: string | null; // ISO — requested check-in date
  nights: number | null; // number of nights, optional
  status: HotelBookingStatus;
  createdAt: string; // ISO
}

export interface WorkingHoursRange {
  start: string; // "HH:MM" 24h
  end: string; // "HH:MM" 24h
}

export interface WorkingDaySchedule {
  day: number; // 0=Sun..6=Sat
  closed: boolean;
  ranges: WorkingHoursRange[]; // 0, 1, or 2 ranges (a second range covers a midday closure)
}

export interface WorkingHoursException {
  date: string; // "YYYY-MM-DD", local
  closed: boolean;
  ranges: WorkingHoursRange[]; // custom hours for this date; ignored when closed
  label?: string; // optional note, e.g. "Eid holiday"
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
  workingSchedule: string; // JSON-encoded WorkingDaySchedule[], see lib/workingHours.ts
  workingExceptions: string; // JSON-encoded WorkingHoursException[], date-specific overrides (holidays etc.)
  instagramUrl: string;
  themeColor: string; // brand accent hex, e.g. "#00b86a"
}

// An admin-managed Instagram post shown in the homepage feed grid.
export interface InstagramPostDTO {
  id: string;
  image: string; // uploaded /api/media path
  permalink: string; // link to the post on Instagram (optional; "" = no link)
  captionAr: string | null;
  captionEn: string | null;
}
