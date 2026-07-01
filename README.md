# Hamlet Al Khalil — Travel Agency Website

Bilingual (Arabic RTL / English) marketing site for a Lebanese Ziyarat & tourism
travel agency, plus a small backend and admin dashboard for managing content.

Built with **Next.js 16** (App Router), **Tailwind CSS v4**, **Prisma 7 + SQLite**,
and cookie-based **username/password auth**.

## Features

- **Public site** — hero, current trips, Ziyarat packages, tourism packages, Arbaeen
  banner, testimonials, Instagram grid. Live language toggle (ar/en), WhatsApp booking.
- **Current Trips** — upcoming departures with status badges (Booking Open / Almost Full /
  Departed / Closed), dates, seats left, a link back to the related package, and WhatsApp
  booking.
- **Admin dashboard** at `/admin` — CRUD for Ziyarat packages, tourism packages, current
  trips, staff users, and site settings (WhatsApp number, hero text, contact info).
- All homepage content is served live from the database, so edits in the dashboard appear
  on the site immediately.

## Getting started

```bash
# 1. Install dependencies (also generates the Prisma client)
npm install

# 2. Copy env and adjust as needed
cp .env.example .env

# 3. Create the SQLite database and load starter content + the first admin
npm run db:push
npm run db:seed

# 4. Run the dev server
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the dashboard.

### First admin login

The seed creates an admin from `.env` (`SEED_ADMIN_USER` / `SEED_ADMIN_PASSWORD`).
Defaults: **admin / admin123** — change these before deploying. Add more staff from
**Admin → Staff Users**.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite file location (default `file:./dev.db`) |
| `AUTH_SECRET` | Secret used to sign admin session cookies (use a long random string) |
| `SEED_ADMIN_USER` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | First admin created by `db:seed` |

## Useful scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync the schema to the SQLite database |
| `npm run db:seed` | Seed starter content + first admin |
| `npm run db:reset` | Reset the database and re-seed |
| `npm run db:studio` | Open Prisma Studio to browse data |

## Project structure

```
prisma/               Prisma schema + seed
src/
  app/
    page.tsx          Public homepage (server component, reads the DB)
    admin/            Admin dashboard (login + protected panel)
    api/              Auth + admin CRUD route handlers
  components/
    site/             Public site components
    admin/            Dashboard UI + managers
  lib/                Prisma client, auth/session, settings, helpers
  server/             Typed data-access helpers for the public site
  data/content.ts     Static UI copy + seed source
  proxy.ts            Auth guard for /admin and /api/admin
```

## Deploying

The SQLite file DB is ideal for local/self-hosted use. To deploy on a platform with an
ephemeral filesystem (e.g. Vercel), switch the Prisma datasource to a hosted database
(Postgres or Turso/libSQL) — the schema is unchanged; only the adapter and `DATABASE_URL`
differ.
