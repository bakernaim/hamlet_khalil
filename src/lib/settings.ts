import type { SiteSettings } from "./types";

// Keys stored in the Setting table, with sensible defaults used when a row is
// missing. Keeping defaults here means the site renders fine on a fresh DB.
export const SETTING_DEFAULTS: SiteSettings = {
  whatsappNumber: "96171234567",
  heroHeadingAr: "رحلاتك إلى الأماكن المقدسة تبدأ من هنا",
  heroHeadingEn: "Your Journey to the Holy Shrines Starts Here",
  heroSubheadingAr: "نرافقك في كل خطوة نحو الأماكن المقدسة بخبرة تمتد لأكثر من ١٥ عاماً",
  heroSubheadingEn:
    "We accompany you every step of the way to the holy sites, with over 15 years of experience",
  phone: "+961 71 234 567",
  addressAr: "بيروت، لبنان — شارع الحمراء، مبنى الخليل، الطابق الثالث",
  addressEn: "Beirut, Lebanon — Hamra Street, Khalil Building, 3rd Floor",
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
