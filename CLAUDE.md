# CLAUDE.md

Guidance for Claude Code when working in this repository. Keep this file in sync when you
change architecture, conventions, or commands.

## What this project is

**Hamlet Al Khalil** — a bilingual (Arabic RTL / English) marketing website for a Lebanese
Ziyarat (religious pilgrimage) & tourism travel agency, with a small backend and an admin
dashboard for managing all content.

Single **Next.js 16** (App Router, Turbopack) full-stack app. **Tailwind CSS v4**,
**Prisma 7 + SQLite**, cookie-based **username/password auth** (bcrypt + jose).

Full docs: [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) · Mindmap: [docs/MINDMAP.md](docs/MINDMAP.md)

## Commands

```bash
npm run dev         # dev server (http://localhost:3000)
npm run build       # production build (must pass before shipping)
npm run lint        # ESLint (must be 0 errors)
npm run db:push     # sync schema → SQLite
npm run db:seed     # load starter content + first admin
npm run db:reset    # wipe + re-seed
npm run db:studio   # browse the DB
npx tsc --noEmit    # typecheck
```

Verify changes with `npm run build` **and** `npm run lint`. The first admin is `admin` /
`admin123` (from `.env`).

## Architecture (how a request flows)

- **Public homepage** [src/app/page.tsx](src/app/page.tsx) is a **server component**
  (`dynamic = "force-dynamic"`). It calls typed helpers in
  [src/server/data.ts](src/server/data.ts) to load published packages/trips/settings, then
  passes them as **props** into client section components in
  [src/components/site/](src/components/site/). Language switching is client-side via
  [LanguageContext](src/context/LanguageContext.tsx) (`useLang()` → `isRTL`).
- **Admin** [src/app/admin/](src/app/admin/): `login/` is public; the `(panel)/` route group
  has a session-guarded layout with a sidebar. Each panel page renders a client "Manager"
  component from [src/components/admin/](src/components/admin/) that fetches its own data from
  the API via the [useResource](src/components/admin/useResource.ts) hook.
- **API** [src/app/api/](src/app/api/): `auth/{login,logout}` set/clear the session cookie;
  `admin/{ziyarat,tourism,trips,banners,users,settings}` are the CRUD handlers (collection `route.ts`
  + item `[id]/route.ts`).
- **Auth guard** [src/proxy.ts](src/proxy.ts) (Next 16 renamed `middleware` → `proxy`)
  protects `/admin/**` (redirect to login) and `/api/admin/**` (401).

## Conventions — follow these

- **Bilingual data**: stored as paired `...Ar` / `...En` columns. In components pick with
  `isRTL ? x.nameAr : x.nameEn`. Never hardcode user-facing copy in one language only.
- **List fields** (e.g. `highlights`) are stored as JSON strings; parse/serialize with
  [src/lib/serialize.ts](src/lib/serialize.ts) (`parseList` / `stringifyList`). DTOs exposed
  to components use real arrays.
- **DTOs**: server → client props use the plain serializable types in
  [src/lib/types.ts](src/lib/types.ts). Convert Prisma rows to DTOs in `server/data.ts`
  (dates → ISO strings, JSON → arrays). Don't pass raw Prisma rows to client components.
- **Prisma client**: import from `@/lib/prisma` (singleton with the better-sqlite3 adapter).
  The generated client lives in `src/generated/prisma` (gitignored) — regenerate with
  `npx prisma generate` after schema edits.
- **Passwords**: hash/verify only via [src/lib/password.ts](src/lib/password.ts). Keep bcrypt
  **out** of anything the edge `proxy.ts` imports — `proxy.ts` uses only jose via
  [src/lib/auth.ts](src/lib/auth.ts).
- **WhatsApp links**: build with `waHref(number, text?)` from
  [src/lib/whatsapp.ts](src/lib/whatsapp.ts) using the settings-driven number, never a
  hardcoded URL.
- **Settings**: key/value `Setting` rows merged over defaults in
  [src/lib/settings.ts](src/lib/settings.ts). Add a new setting by extending `SETTING_DEFAULTS`
  + the `SiteSettings` type.
- **Theme**: dual light/dark driven by semantic tokens in
  [src/app/globals.css](src/app/globals.css) — `:root` = light (warm off-white), `html.dark`
  = the original dark navy. Use the token utilities (`bg-page`, `bg-page-alt`, `bg-card`,
  `border-line`, `text-ink`, `text-muted`, `text-soft`, `text-accent`, `bg-brand`,
  `bg-brand-hover`) instead of hex colors. A class-based `dark:` variant (`@custom-variant`)
  exists for the few cases a token swap can't cover. The initial theme comes from
  localStorage `theme` / device preference via the inline script in
  [layout.tsx](src/app/layout.tsx) (no-flash) and is toggled by
  [ThemeToggle](src/components/site/ThemeToggle.tsx) (public navbar, admin sidebar, login).
  The **accent color is a dashboard setting** (`themeColor`): the root layout derives
  hover/text/sheen shades via [src/lib/color.ts](src/lib/color.ts) and injects them as CSS
  vars, so never hardcode the green. Hero and promo banners keep photo backgrounds with dark
  overlays in both themes. Public site is RTL-capable; admin is LTR and follows the same
  theme.
- **Admin UI primitives**: reuse `Field`, `Input`, `Textarea`, `Select`, `Toggle`, `Button`,
  `Modal`, `ErrorText`, `ImageUpload` from [src/components/admin/ui.tsx](src/components/admin/ui.tsx).
- **Route handler input coercion**: use helpers in [src/lib/api.ts](src/lib/api.ts)
  (`str`, `int`, `bool`, `optionalDate`, `badRequest`, …).
- **Image uploads**: admin forms use `ImageUpload`, which POSTs to `api/admin/upload` and
  stores files in `public/uploads/` (gitignored). Use `saveUpload`/`removeUpload` from
  [src/lib/uploads.ts](src/lib/uploads.ts); item DELETE/PUT handlers call `removeUpload` so
  deleting a record (or replacing its image) also deletes the uploaded file. `removeUpload`
  never touches anything outside `/uploads/` (seed images in `/shrines` are safe).

## Adding things (recipes)

- **New editable field on a model**: edit `prisma/schema.prisma` → `npm run db:push` →
  add it to the DTO/type (`lib/types.ts`), the mapper (`server/data.ts`), the API create/update
  handlers, and the admin Manager form + the public component.
- **New content type**: add a Prisma model + seed data, a `server/data.ts` getter, an
  `api/admin/<name>` route pair, a `<Name>Manager.tsx` + `admin/(panel)/<name>/page.tsx`, a
  sidebar entry in [Sidebar.tsx](src/components/admin/Sidebar.tsx), and a public section wired
  into `page.tsx`.

## Gotchas

- **Prisma 7 specifics**: no `url` in `schema.prisma` (it lives in
  [prisma.config.ts](prisma.config.ts)); runtime connects through the
  `@prisma/adapter-better-sqlite3` driver adapter; `.env` is loaded manually
  (`process.loadEnvFile`) in config/seed. `better-sqlite3` is in `serverExternalPackages`
  ([next.config.ts](next.config.ts)).
- Client components that read `useSearchParams()` must be wrapped in `<Suspense>` (see the
  login page) or the build fails.
- The homepage is `force-dynamic` so admin edits show without a rebuild.
- Don't commit `dev.db`, `.env`, or `src/generated` (all gitignored).

## Do / Don't

- Do keep both build and lint green; match the existing Tailwind class style (the repo uses
  `bg-gradient-to-*` etc. — ignore the v4 "canonical class" lint suggestions to stay
  consistent).
- Don't introduce heavy client libs for animation — CSS + small IntersectionObserver hooks
  ([Reveal](src/components/site/Reveal.tsx), [CountUp](src/components/site/CountUp.tsx)) are the
  pattern.
- Don't leak `passwordHash` from any API (`users` routes already `select` safe fields).
