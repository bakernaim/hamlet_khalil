#!/bin/sh
set -e

# DATABASE_URL is file-based (e.g. file:./prisma/dev.db), resolved relative to CWD (/app).
DB_PATH="${DATABASE_URL#file:}"

if [ -f "$DB_PATH" ] && [ -s "$DB_PATH" ]; then
  NEEDS_SEED=0
else
  NEEDS_SEED=1
fi

echo "Syncing database schema..."
npx prisma db push

if [ "$NEEDS_SEED" = "1" ]; then
  echo "No existing database found — seeding starter content..."
  npx tsx prisma/seed.ts
fi

exec "$@"
