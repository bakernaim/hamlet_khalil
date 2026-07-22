# Deployment

How Hamlet Al Khalil gets built, shipped, and run in production — and how to fix it
when it breaks.

## The model in one paragraph

There is **no build on the server**. You build locally (`npm run build`, Next
`output: "standalone"`), then [deploy.sh](deploy.sh) zips the build output + `node_modules` +
Prisma files, ships the archive over SSH, unpacks it, and runs `docker compose up -d --build`
on the server. The Dockerfile only *copies* those prebuilt artifacts into a `node:22-slim`
image — it never runs `npm install` or `npm run build`. Traffic reaches the app through
**Nginx Proxy Manager** (same compose stack); the app container exposes no host ports.

## Prerequisites

- **Local Node major must match the Dockerfile's base image** (currently Node 22 ↔
  `node:22-slim`). `node_modules` is built locally and contains native, ABI-tied binaries
  (`better-sqlite3`, Prisma engines). If you upgrade local Node, bump `FROM node:XX-slim`
  in [Dockerfile](Dockerfile) to the same major. Local machine must also be glibc Linux
  (not Alpine/musl, not macOS) for the same reason.
- An SSH alias **`hamlat-alkhalil`** in your `~/.ssh/config` pointing at the server, with
  key auth working.
- Docker + the compose plugin installed on the server.
- A **`.env.production`** file at the repo root (gitignored, copied into the archive).
  It must contain at least:

  ```bash
  AUTH_SECRET="<long random string — NOT the dev one>"
  SEED_ADMIN_USER="admin"
  SEED_ADMIN_PASSWORD="<real password>"
  SEED_ADMIN_NAME="Site Administrator"
  ```

  `DATABASE_URL` is **not** needed here — [docker-compose.yml](docker-compose.yml) hardcodes
  `file:./data/dev.db` in `environment:`, which overrides `env_file`.

## Deploying

```bash
./deploy.sh
```

That's the whole procedure for both first deploy and updates. It: builds, stages under
`deploy_stage/` (`app/` + top-level `docker-compose.yml`), zips **with `-y`** (the standalone
output contains a symlink that must survive), uploads, swaps `~/app` and
`~/docker-compose.yml` on the server, and restarts the stack. Server-side `data/` (DB) and
`npm/` (proxy config + certs) are never touched by a deploy.

## Server layout (`~` on the server)

```
~
├── docker-compose.yml     # replaced on every deploy
├── app/                   # replaced on every deploy (build output, node_modules, prisma, Dockerfile)
├── data/                  # PERSISTENT — bind-mounted to /app/data, holds dev.db (SQLite)
└── npm/                   # PERSISTENT — Nginx Proxy Manager config + Let's Encrypt certs
```

Docker named volumes `private-uploads` (passport scans + admin image uploads) and
`public-uploads` also persist across deploys.

## First boot / seeding

[docker-entrypoint.sh](docker-entrypoint.sh) runs on every container start:
`prisma db push` (schema sync), and — only if `dev.db` didn't exist yet — `tsx prisma/seed.ts`
(starter content + the admin account from `SEED_ADMIN_*`). So schema changes apply
automatically on deploy; the seed never overwrites an existing DB.

First-time server setup only:

```bash
mkdir -p ~/data && sudo chown -R 1001:1001 ~/data   # container runs as uid 1001 ("nextjs")
```

Then add a Proxy Host in the NPM admin UI (`http://<server>:81`, default creds
`admin@example.com` / `changeme` — change immediately): domain → forward to
**`app` : `3000`** (they share the compose network), and request a Let's Encrypt cert
in the SSL tab.

## Persistence & backups

Everything worth backing up:

| What | Where | How to back up |
|---|---|---|
| Database (all content, bookings, users) | `~/data/dev.db` | `scp hamlat-alkhalil:data/dev.db backup/` (safest after `docker compose stop app`) |
| Passports + admin-uploaded images | `private-uploads` volume | `docker run --rm -v <project>_private-uploads:/v -v ~/backup:/b debian tar czf /b/private-uploads.tgz -C /v .` |
| Proxy config + TLS certs | `~/npm/` | plain `tar`/`scp` |

## Troubleshooting (all of these actually happened)

- **`P1013: The provided database string is invalid` on start** — despite the wording, this
  usually means `dev.db` exists **as a directory**, not a file. Classic cause: a bind mount
  of a single file (`./data/dev.db:/app/data/dev.db`) whose host source didn't exist —
  Docker silently creates a *directory* on both sides. That's why compose mounts the
  **directory** (`./data:/app/data`). Fix: `docker compose down && rm -rf ~/data/dev.db`
  (verify it's an empty dir first!) and restart.
- **`ERR_DLOPEN_FAILED` / `NODE_MODULE_VERSION 127 vs 115` / `Module did not self-register`**
  — native binary built on one Node major, run on another. The Dockerfile base image and the
  local Node that ran `npm install` disagree. Align them (see Prerequisites), then
  `docker compose build --no-cache app`.
- **SQLite "unable to open database file" / permission denied** — `~/data` isn't writable by
  uid 1001. `sudo chown -R 1001:1001 ~/data`.
- **Old code still serving after deploy** — compose cached the image layers. The deploy
  script uses `--build`, which is normally enough; if something looks stale:
  `docker compose build --no-cache app && docker compose up -d`.
- **Logs**: `ssh hamlat-alkhalil docker compose logs -f app`

## What NOT to do

- Don't `docker compose down -v` — `-v` deletes the uploads volumes (passport PII, images).
- Don't edit files inside `~/app` on the server — the next deploy wipes the whole directory.
- Don't create `~/data/dev.db` by hand — let the entrypoint create + seed it.
- Don't ship without a real `AUTH_SECRET` in `.env.production` — the dev fallback would let
  anyone forge an admin session cookie.
