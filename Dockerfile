# Debian-based (glibc), not Alpine (musl): the local node_modules this Dockerfile
# copies in was built on a glibc host, and ships glibc-linked native binaries
# (Prisma's schema/query engines, better-sqlite3) that won't run under musl.
# The Node major must also match the machine that built node_modules (native
# addons are tied to NODE_MODULE_VERSION — Node 22 = 127).
FROM node:22-slim
WORKDIR /app

ENV NODE_ENV=production

# Prisma's engine binaries are linked against OpenSSL.
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Don't run as root
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# Prisma schema + seed script + config (holds the datasource URL logic for Prisma 7),
# needed to sync/seed the SQLite DB on start.
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
# Subset of src/ the seed script imports (generated Prisma client, starter
# content, lib helpers) — staged by deploy.sh.
COPY src ./src
# Full node_modules (merged over .next/standalone's traced subset): the Prisma
# CLI + tsx have a deep transitive dependency tree that isn't worth curating by
# hand — they only run via the entrypoint below, not in the traced server bundle.
COPY node_modules ./node_modules
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN mkdir -p /app/data /app/private_uploads/images /app/private_uploads/passports /app/public/uploads \
    && chown -R nextjs:nodejs /app \
    && chmod +x /app/docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created automatically by "output: standalone"
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
