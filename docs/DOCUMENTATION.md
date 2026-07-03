# Hamlet Al Khalil — Full Documentation

Bilingual (Arabic RTL / English) travel-agency website with a small backend and an admin
dashboard. This document is the complete reference for the codebase.

- Quick start & scripts: [../README.md](../README.md)
- Working conventions for Claude: [../CLAUDE.md](../CLAUDE.md)
- Visual map: [MINDMAP.md](MINDMAP.md)

---

## 1. Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` in `globals.css`) |
| Database | SQLite via Prisma 7 + `@prisma/adapter-better-sqlite3` |
| Auth | Username/password — bcrypt hashing + `jose` (HS256 JWT) session cookie |
| Icons | `lucide-react` |
| Fonts | Reem Kufi (AR headings), Cairo (AR body), Inter (EN) |

Design language: light warm off-white background (`#eef4f0`, alternate sections `#e3ece6`),
white cards, borders `#d9e3dd`, ink text `#0c1a14`, muted text `#5b6b63`, green accent
(`#00b86a` fills / `#00995a` for green text on light). Hero and promo banners keep photo
backgrounds with dark overlays and white text.

---

## 2. Directory layout

```
prisma/
  schema.prisma          Data models (User, ZiyaratPackage, TourismPackage, CurrentTrip, Setting)
  seed.ts                Seeds starter content from src/data/content.ts + first admin
prisma.config.ts         Prisma 7 config: schema path, seed command, datasource url, .env load
next.config.ts           serverExternalPackages for better-sqlite3
src/
  app/
    layout.tsx           Root layout: <html dir="rtl">, fonts, LanguageProvider
    page.tsx             PUBLIC homepage — server component, reads DB, passes props
    globals.css          Theme vars + animations (aurora, reveal, count-up, shimmer)
    admin/
      layout.tsx         Admin base wrapper (LTR, noindex)
      login/page.tsx     Login screen (client, wrapped in <Suspense>)
      (panel)/
        layout.tsx       Session guard + Sidebar shell
        page.tsx         Dashboard overview (counts, trips-by-status)
        ziyarat/page.tsx <ZiyaratManager/>
        tourism/page.tsx <TourismManager/>
        trips/page.tsx   <TripsManager/>
        users/page.tsx   <UsersManager/>
        settings/page.tsx <SettingsManager/>
    api/
      auth/login/route.ts    POST — verify creds, set cookie
      auth/logout/route.ts   POST — clear cookie
      admin/ziyarat/route.ts + [id]/route.ts
      admin/tourism/route.ts + [id]/route.ts
      admin/trips/route.ts   + [id]/route.ts
      admin/users/route.ts   + [id]/route.ts
      admin/settings/route.ts
  components/
    site/                Public sections (Navbar, Hero, CurrentTrips, ZiyaratPackages, …)
                         + Reveal, CountUp animation helpers
    admin/               Sidebar, ui.tsx primitives, useResource hook, *Manager components
  context/
    LanguageContext.tsx  useLang() → { lang, toggleLang, isRTL }
  lib/
    prisma.ts            PrismaClient singleton (better-sqlite3 adapter)
    auth.ts              jose session sign/verify + cookie options (edge-safe)
    password.ts          bcrypt hash/verify (server-only; kept out of edge bundle)
    session.ts           getSession()/requireSession() from next/headers cookies
    types.ts             DTOs passed to client components (SiteSettings, *DTO)
    serialize.ts         parseList / stringifyList for JSON list columns
    settings.ts          SETTING_DEFAULTS + buildSettings()
    whatsapp.ts          waHref(number, text?)
    api.ts               Route-handler coercion helpers (str/int/bool/optionalDate/…)
  server/
    data.ts              Typed getters used by the public server component
  data/
    content.ts           Static UI copy (nav, testimonials, trust) + seed source
  proxy.ts               Auth guard for /admin/** and /api/admin/**
  generated/prisma/      Generated Prisma client (gitignored)
```

---

## 3. Data model

Defined in [../prisma/schema.prisma](../prisma/schema.prisma). Bilingual fields are paired
`...Ar` / `...En`; list fields are JSON strings.

- **User** — `id, username @unique, passwordHash, name, role ("admin"|"editor"), timestamps`.
- **ZiyaratPackage** — `slug @unique, flag, name*, duration*, price, badge*?, highlights* (JSON),
  image, color, sortOrder, published`.
- **TourismPackage** — `slug @unique, flag, name*, duration*, price, desc*, image, sortOrder,
  published`.
- **CurrentTrip** — `title*, destination*, departureDate, returnDate?, price, seatsLeft?,
  status ("OPEN"|"ALMOST_FULL"|"DEPARTED"|"CLOSED"), image?, packageType?, packageSlug?,
  sortOrder, published`.
- **Setting** — `key @id, value`. Keys: `whatsappNumber, heroHeadingAr/En,
  heroSubheadingAr/En, phone, addressAr/En` (defaults in `lib/settings.ts`).

### Prisma 7 notes (important)

- The datasource `url` is **not** in `schema.prisma` — it lives in
  [../prisma.config.ts](../prisma.config.ts) for CLI, and the runtime connects through a
  **driver adapter** (`PrismaBetterSqlite3`) constructed in `lib/prisma.ts`.
- Prisma 7 does **not** auto-load `.env`; both `prisma.config.ts` and `prisma/seed.ts` call
  `process.loadEnvFile()`.
- The generated client output is `src/generated/prisma` (import via `@/generated/prisma`).
- `better-sqlite3` + the adapter are listed in `serverExternalPackages` so the bundler leaves
  the native module alone.

---

## 4. Public site data flow

1. [page.tsx](../src/app/page.tsx) (`export const dynamic = "force-dynamic"`) awaits
   `getSettings`, `getZiyaratPackages`, `getTourismPackages`, `getCurrentTrips` from
   [server/data.ts](../src/server/data.ts).
2. `server/data.ts` queries Prisma (published-only, ordered by `sortOrder`) and maps each row
   to a **DTO** (`lib/types.ts`) — parsing JSON highlights into arrays and converting dates to
   ISO strings.
3. DTOs are passed as props into the client section components. Each component reads
   `isRTL` from `useLang()` and picks the `Ar`/`En` value.
4. WhatsApp buttons build their href with `waHref(settings.whatsappNumber, message)`.

Because the page is `force-dynamic`, dashboard edits appear on the next page load without a
rebuild.

### Sections (in `page.tsx` order)

`Navbar → Hero → CurrentTrips → ZiyaratPackages → TrustBar → TourismPackages → ArbaeenBanner
→ Testimonials → InstagramFeed → Footer → FloatingButtons`.

**CurrentTrips** ([component](../src/components/site/CurrentTrips.tsx)) renders each upcoming
departure with a color-coded status badge, departure/return dates, seats-left (with urgency
styling when ≤5), a **"Package"** link (`#${packageType}-${packageSlug}` anchors on the
package cards), and a WhatsApp **Book a Seat** button. Trips with status `DEPARTED`/`CLOSED`
show as unavailable.

`TrustBar`, `Testimonials`, `InstagramFeed`, and the Arbaeen banner copy remain static
(from `data/content.ts`); everything else is DB-driven.

---

## 5. Authentication & authorization

- **Session**: `signSession()` (jose HS256, `AUTH_SECRET`) → httpOnly `hk_session` cookie
  (7-day). `verifySession()` decodes it. See [lib/auth.ts](../src/lib/auth.ts).
- **Passwords**: `hashPassword` / `verifyPassword` (bcrypt) in
  [lib/password.ts](../src/lib/password.ts) — deliberately separate so the edge `proxy.ts`
  never imports bcrypt.
- **Guard**: [proxy.ts](../src/proxy.ts) (Next 16's renamed middleware) matches `/admin/:path*`
  and `/api/admin/:path*`. No session → `/admin/**` redirects to `/admin/login?next=…`,
  `/api/admin/**` returns 401. Already-logged-in users hitting `/admin/login` are bounced to
  `/admin`.
- **Server-side reads**: admin pages use `getSession()` from
  [lib/session.ts](../src/lib/session.ts) (belt-and-suspenders with the proxy).
- **Roles**: `admin` and `editor` exist; the UI/routes currently treat both as full access.
  Guards prevent deleting your own account, deleting the last admin, and demoting the last
  admin.

### Login flow

`POST /api/auth/login {username,password}` → look up user → `verifyPassword` → `signSession`
→ `Set-Cookie`. Logout clears the cookie. The client login form lives at
[admin/login/page.tsx](../src/app/admin/login/page.tsx).

---

## 6. Admin API reference

All under `/api/admin/*` and protected by `proxy.ts`. Bodies are JSON. Input is coerced with
helpers from [lib/api.ts](../src/lib/api.ts).

| Resource | Collection | Item |
| --- | --- | --- |
| Ziyarat | `GET, POST /api/admin/ziyarat` | `GET, PUT, DELETE /api/admin/ziyarat/[id]` |
| Tourism | `GET, POST /api/admin/tourism` | `GET, PUT, DELETE /api/admin/tourism/[id]` |
| Trips | `GET, POST /api/admin/trips` | `GET, PUT, DELETE /api/admin/trips/[id]` |
| Users | `GET, POST /api/admin/users` | `PUT, DELETE /api/admin/users/[id]` |
| Settings | `GET, PUT /api/admin/settings` | — (single key/value document) |

Notes:
- Packages validate a unique `slug`; highlights accept an array **or** newline/comma text
  (`stringifyList`).
- Trips require a valid `departureDate`; `status` is validated against the enum.
- Users never return `passwordHash`; password must be ≥6 chars; on edit, a blank password
  keeps the current one.
- `PUT /api/admin/settings` upserts only known keys in a transaction and returns the merged
  `SiteSettings`.

---

## 7. Admin dashboard UI

- **Shell**: [(panel)/layout.tsx](../src/app/admin/(panel)/layout.tsx) guards the session and
  renders [Sidebar.tsx](../src/components/admin/Sidebar.tsx) (Dashboard, Ziyarat, Tourism,
  Current Trips, Staff Users, Site Settings, View Website, Sign Out).
- **Overview**: [(panel)/page.tsx](../src/app/admin/(panel)/page.tsx) — stat cards + trips
  grouped by status + quick actions.
- **Managers** ([components/admin](../src/components/admin/)) are client components that fetch
  their data through the [useResource](../src/components/admin/useResource.ts) hook
  (`items, loading, error, reload, save, remove`) and render a table + a `Modal` form built
  from the [ui.tsx](../src/components/admin/ui.tsx) primitives. `SettingsManager` is a single
  form (fetches the settings document directly).

---

## 8. Styling & animation

Theme variables and all custom effects live in
[globals.css](../src/app/globals.css):

- `.reveal` / `.reveal-in` — scroll-reveal (driven by
  [Reveal.tsx](../src/components/site/Reveal.tsx), an IntersectionObserver wrapper).
- `.hero-fade`, `.hero-kenburns`, `.aurora` — hero entrance + animated background.
- `.shimmer-badge` — sweep on the "Most Popular" badge.
- `CountUp` ([component](../src/components/site/CountUp.tsx)) animates the hero stats when in
  view.
- All heavy motion is disabled under `@media (prefers-reduced-motion: reduce)`.

No animation libraries — CSS + two tiny hooks only.

---

## 9. Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `DATABASE_URL` | SQLite file | `file:./dev.db` (→ project-root `dev.db`) |
| `AUTH_SECRET` | Session cookie signing secret | dev placeholder — **change in prod** |
| `SEED_ADMIN_USER` | First admin username | `admin` |
| `SEED_ADMIN_PASSWORD` | First admin password | `admin123` |
| `SEED_ADMIN_NAME` | First admin display name | `Site Administrator` |

`.env` is gitignored; `.env.example` is the template.

---

## 10. Local development workflow

```bash
npm install                 # installs + prisma generate (postinstall)
cp .env.example .env
npm run db:push             # create tables
npm run db:seed             # starter content + first admin
npm run dev
```

Before shipping a change, run **`npm run build`** and **`npm run lint`** (both must pass) and,
for schema changes, `npm run db:push` + regenerate. Use `npm run db:reset` to start clean.

---

## 11. Deployment

SQLite is perfect for local/self-hosted (a persistent disk). On an ephemeral host (e.g.
Vercel) switch the Prisma datasource to hosted Postgres or Turso/libSQL — the schema is
unchanged; swap the adapter in `lib/prisma.ts` and point `DATABASE_URL` at the new database.
Set a strong `AUTH_SECRET` and change the seeded admin password.

---

## 12. Testing / verification checklist

- Homepage renders DB content in both languages; language toggle flips copy; WhatsApp links
  use the settings number.
- Current Trips show correct badges, dates, seats, package links, and booking buttons.
- `/admin` redirects to login when logged out; bad creds rejected; good creds land on the
  dashboard; logout clears the session; `/api/admin/*` returns 401 without a cookie.
- Create/edit/delete a Ziyarat package, tourism package, and current trip → changes reflect on
  the homepage. Edit settings → propagates site-wide. Create a staff user → they can log in.
- `npm run build`, `npm run lint`, and `npx tsc --noEmit` all pass.
