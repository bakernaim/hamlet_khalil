FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# Prisma schema + seed script + config (holds the datasource URL logic for Prisma 7),
# needed to sync/seed the SQLite DB on start.
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
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
