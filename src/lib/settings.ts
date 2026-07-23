import type { SectionCopy, SectionName, SiteSettings } from "./types";
import { SECTION_NAMES } from "./types";
import { DEFAULT_WORKING_SCHEDULE, stringifyWorkingSchedule } from "./workingHours";

// Default heading copy for each editable homepage section (was hardcoded in the
// section components). desc "" = the section shows no description by default.
const SECTION_COPY_DEFAULTS: Record<SectionName, SectionCopy> = {
  trips: {
    titleAr: "الرحلات المتاحة الآن",
    titleEn: "Current Trips",
    descAr: "احجز مقعدك في رحلاتنا القادمة قبل نفاد الأماكن",
    descEn: "Reserve your seat on our upcoming departures before they sell out",
  },
  ziyarat: {
    titleAr: "زيارات الأماكن المقدسة",
    titleEn: "Ziyarat Packages",
    descAr: "رحلات روحانية منظمة مع مرشد ديني متخصص",
    descEn: "Fully organized spiritual journeys with a specialist religious guide",
  },
  tourism: {
    titleAr: "الباقات السياحية",
    titleEn: "Tourism Packages",
    descAr: "رحلات سياحية مميزة بأسعار تنافسية وخدمة متكاملة",
    descEn: "Premium destinations at competitive prices with full services",
  },
  hotels: {
    titleAr: "نساعدك في حجز فندقك",
    titleEn: "We help you book your hotel",
    descAr:
      "اختر من الفنادق التي نتعامل معها في العراق وإيران، وأرسل لنا طلبك — سنتواصل معك عبر واتساب لتأكيد الحجز.",
    descEn:
      "Choose from the hotels we work with in Iraq and Iran, send us your request, and we'll reach out on WhatsApp to confirm your booking.",
  },
  flights: {
    titleAr: "نحجز لك تذكرة طيرانك",
    titleEn: "We book your flight ticket",
    descAr:
      "اختر رحلتك، حدّد التاريخ، وأرسل لنا طلبك — سنتواصل معك عبر واتساب لتأكيد الحجز والسعر.",
    descEn:
      "Pick your flight, choose a date, and send us your request — we'll reach out on WhatsApp to confirm the booking and price.",
  },
  how: {
    titleAr: "كيف تحجز رحلتك؟",
    titleEn: "How It Works",
    descAr: "من اختيار الباقة حتى الوصول — أربع خطوات فقط",
    descEn: "From choosing a package to arrival — just four steps",
  },
  gallery: {
    titleAr: "لحظات من رحلاتنا",
    titleEn: "Moments From Our Trips",
    descAr: "",
    descEn: "",
  },
  reviews: {
    titleAr: "ماذا قالوا عنّا",
    titleEn: "What They Say",
    descAr: "",
    descEn: "",
  },
  faq: {
    titleAr: "كل ما تريد معرفته",
    titleEn: "Everything You Need to Know",
    descAr: "",
    descEn: "",
  },
  instagram: {
    titleAr: "تابعونا على انستغرام",
    titleEn: "Follow Us on Instagram",
    descAr: "",
    descEn: "",
  },
  about: {
    titleAr: "لماذا تختارنا",
    titleEn: "Why Choose Us",
    descAr: "",
    descEn: "",
  },
};

const capitalize = (name: SectionName) =>
  (name.charAt(0).toUpperCase() + name.slice(1)) as Capitalize<SectionName>;

// Flatten SECTION_COPY_DEFAULTS into the settings keys (sectionTripsTitleAr, …).
function flattenSectionCopy(): Record<`section${Capitalize<SectionName>}${"TitleAr" | "TitleEn" | "DescAr" | "DescEn"}`, string> {
  const out: Record<string, string> = {};
  for (const name of SECTION_NAMES) {
    const cap = capitalize(name);
    const copy = SECTION_COPY_DEFAULTS[name];
    out[`section${cap}TitleAr`] = copy.titleAr;
    out[`section${cap}TitleEn`] = copy.titleEn;
    out[`section${cap}DescAr`] = copy.descAr;
    out[`section${cap}DescEn`] = copy.descEn;
  }
  return out as ReturnType<typeof flattenSectionCopy>;
}

// The setting key for one field of one section's copy, e.g. ("trips", "TitleAr").
export function sectionCopyKey(
  name: SectionName,
  field: "TitleAr" | "TitleEn" | "DescAr" | "DescEn"
): keyof SiteSettings {
  return `section${capitalize(name)}${field}`;
}

// Pick one section's bilingual copy out of the flat settings object.
export function sectionCopy(settings: SiteSettings, name: SectionName): SectionCopy {
  const cap = capitalize(name);
  return {
    titleAr: settings[`section${cap}TitleAr`],
    titleEn: settings[`section${cap}TitleEn`],
    descAr: settings[`section${cap}DescAr`],
    descEn: settings[`section${cap}DescEn`],
  };
}

// Keys stored in the Setting table, with sensible defaults used when a row is
// missing. Keeping defaults here means the site renders fine on a fresh DB.
export const SETTING_DEFAULTS: SiteSettings = {
  ...flattenSectionCopy(),
  whatsappNumber: "96171234567",
  heroHeadingAr: "رحلاتك إلى الأماكن المقدسة تبدأ من هنا",
  heroHeadingEn: "Your Journey to the Holy Shrines Starts Here",
  heroSubheadingAr: "نرافقك في كل خطوة نحو الأماكن المقدسة بخبرة تمتد لأكثر من ١٥ عاماً",
  heroSubheadingEn:
    "We accompany you every step of the way to the holy sites, with over 15 years of experience",
  statPilgrims: "5000",
  statYears: "15",
  statDestinations: "20",
  phone: "+961 71 234 567",
  addressAr: "بيروت، لبنان — شارع الحمراء، مبنى الخليل، الطابق الثالث",
  addressEn: "Beirut, Lebanon — Hamra Street, Khalil Building, 3rd Floor",
  workingSchedule: stringifyWorkingSchedule(DEFAULT_WORKING_SCHEDULE),
  workingExceptions: "[]",
  instagramUrl: "https://instagram.com/hamlet_alkhalil",
  themeColor: "#00b86a",
};

export const SETTING_KEYS = Object.keys(SETTING_DEFAULTS) as (keyof SiteSettings)[];

// Merge raw key/value rows over the defaults into a typed settings object.
export function buildSettings(rows: { key: string; value: string }[]): SiteSettings {
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const result = { ...SETTING_DEFAULTS };
  for (const key of SETTING_KEYS) {
    const v = map.get(key);
    if (v != null && v !== "") result[key] = v;
  }
  return result;
}
