import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/index.js";
import {
  ziyaratPackages,
  tourismPackages,
} from "../src/data/content.js";
import { stringifyList } from "../src/lib/serialize.js";
import { SETTING_DEFAULTS, SETTING_KEYS } from "../src/lib/settings.js";

try {
  process.loadEnvFile(path.join(process.cwd(), ".env"));
} catch {
  /* env may already be present */
}

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const ZIYARAT_IMAGES: Record<string, string> = {
  iraq: "/shrines/hussain-karbala.jpg",
  iran: "/shrines/reza-mashhad.jpg",
  arbaeen: "/shrines/arbaeen-crowd.jpg",
  syria: "/shrines/zaynab-damascus.jpg",
};

const TOURISM_IMAGES: Record<string, string> = {
  turkey: "/shrines/turkey-istanbul.jpg",
  dubai: "/shrines/dubai-skyline.jpg",
  georgia: "/shrines/georgia-tbilisi.jpg",
  egypt: "/shrines/egypt-pyramids.jpg",
};

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d;
}

async function main() {
  // ── Ziyarat packages ─────────────────────────────────────────────
  for (let i = 0; i < ziyaratPackages.length; i++) {
    const p = ziyaratPackages[i];
    const data = {
      flag: p.flag,
      nameAr: p.name.ar,
      nameEn: p.name.en,
      durationAr: p.duration.ar,
      durationEn: p.duration.en,
      badgeAr: p.badge?.ar ?? null,
      badgeEn: p.badge?.en ?? null,
      highlightsAr: stringifyList(p.highlights.ar),
      highlightsEn: stringifyList(p.highlights.en),
      infoAr: p.info?.ar ?? "",
      infoEn: p.info?.en ?? "",
      image: ZIYARAT_IMAGES[p.id] ?? "/shrines/hussain-karbala.jpg",
      color: p.color,
      sortOrder: i,
      published: true,
    };
    await prisma.ziyaratPackage.upsert({
      where: { slug: p.id },
      create: { slug: p.id, ...data },
      update: data,
    });
  }

  // ── Tourism packages ─────────────────────────────────────────────
  for (let i = 0; i < tourismPackages.length; i++) {
    const p = tourismPackages[i];
    const data = {
      flag: p.flag,
      nameAr: p.name.ar,
      nameEn: p.name.en,
      durationAr: p.duration.ar,
      durationEn: p.duration.en,
      descAr: p.desc.ar,
      descEn: p.desc.en,
      infoAr: p.info?.ar ?? "",
      infoEn: p.info?.en ?? "",
      image: TOURISM_IMAGES[p.id] ?? "/shrines/turkey-istanbul.jpg",
      sortOrder: i,
      published: true,
    };
    await prisma.tourismPackage.upsert({
      where: { slug: p.id },
      create: { slug: p.id, ...data },
      update: data,
    });
  }

  // ── Sample current trips (only if none exist) ────────────────────
  const tripCount = await prisma.currentTrip.count();
  if (tripCount === 0) {
    await prisma.currentTrip.createMany({
      data: [
        {
          titleAr: "قافلة كربلاء والنجف الأسبوعية",
          titleEn: "Weekly Karbala & Najaf Caravan",
          destinationAr: "العراق",
          destinationEn: "Iraq",
          departureDate: daysFromNow(7),
          returnDate: daysFromNow(14),
          frequency: "WEEKLY",
          recurEndDate: daysFromNow(90),
          price: 650,
          seatsLeft: 20,
          status: "OPEN",
          image: "/shrines/ali-najaf.jpg",
          packageType: "ziyarat",
          packageSlug: "iraq",
          sortOrder: 0,
          published: true,
        },
        {
          titleAr: "زيارة مشهد وقم المقدسة",
          titleEn: "Mashhad & Holy Qom Ziyarat",
          destinationAr: "إيران",
          destinationEn: "Iran",
          departureDate: daysFromNow(25),
          returnDate: daysFromNow(35),
          price: 950,
          seatsLeft: 18,
          status: "OPEN",
          image: "/shrines/reza-mashhad.jpg",
          packageType: "ziyarat",
          packageSlug: "iran",
          sortOrder: 1,
          published: true,
        },
        {
          titleAr: "مسيرة الأربعين الكبرى",
          titleEn: "Grand Arbaeen Walk",
          destinationAr: "العراق",
          destinationEn: "Iraq",
          departureDate: daysFromNow(48),
          returnDate: daysFromNow(62),
          price: 1100,
          seatsLeft: 2,
          status: "ALMOST_FULL",
          image: "/shrines/arbaeen-crowd.jpg",
          packageType: "ziyarat",
          packageSlug: "arbaeen",
          sortOrder: 2,
          published: true,
        },
        {
          titleAr: "رحلة تركيا العائلية",
          titleEn: "Turkey Family Getaway",
          destinationAr: "تركيا",
          destinationEn: "Turkey",
          departureDate: daysFromNow(40),
          returnDate: daysFromNow(47),
          price: 780,
          seatsLeft: 24,
          status: "OPEN",
          image: "/shrines/turkey-istanbul.jpg",
          packageType: "tourism",
          packageSlug: "turkey",
          sortOrder: 3,
          published: true,
        },
      ],
    });
  }

  // ── Promo banners (only if none exist) ───────────────────────────
  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    await prisma.banner.create({
      data: {
        titleAr: "موكب الأربعين ٢٠٢٦",
        titleEn: "Arbaeen 2026 Convoy",
        badgeAr: "أعظم موكب في التاريخ",
        badgeEn: "The Greatest March in History",
        textAr: "انضم إلى الملايين في أكبر تجمع بشري على وجه الأرض",
        textEn: "Join millions in the largest human gathering on Earth — Holy Karbala",
        image: "/shrines/arbaeen-crowd.jpg",
        theme: "amber",
        targetDate: new Date("2026-08-03T00:00:00Z"), // 20 Safar 1448 (estimated)
        priceFrom: 1100,
        noteAr: "١٤ يوماً · شامل كل شيء",
        noteEn: "14 Days · All Inclusive",
        ctaAr: "سجّل مكانك الآن",
        ctaEn: "Reserve Your Spot Now",
        sortOrder: 0,
        published: true,
      },
    });
    console.log("✔ Seeded the Arbaeen promo banner");
  }

  // ── Settings ─────────────────────────────────────────────────────
  for (const key of SETTING_KEYS) {
    const value = SETTING_DEFAULTS[key];
    await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: {}, // don't clobber admin-edited values on re-seed
    });
  }

  // ── First admin user ─────────────────────────────────────────────
  const username = process.env.SEED_ADMIN_USER ?? "admin";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const name = process.env.SEED_ADMIN_NAME ?? "Site Administrator";
  const existing = await prisma.user.findUnique({ where: { username } });
  if (!existing) {
    await prisma.user.create({
      data: {
        username,
        name,
        role: "admin",
        passwordHash: await bcrypt.hash(password, 10),
      },
    });
    console.log(`✔ Created admin user "${username}"`);
  } else {
    console.log(`• Admin user "${username}" already exists — left unchanged`);
  }

  console.log("✔ Seed complete");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
