#!/bin/bash
# Builds the app locally, gathers everything the Dockerfile/docker-compose need,
# zips it up, ships it to the server over the "hamlat-alkhalil" SSH alias, and
# brings the stack up there.
set -euo pipefail
cd "$(dirname "$0")"

SERVER_HOST="hamlat-alkhalil"           # must be configured in your ~/.ssh/config
REMOTE_DIR="~"

STAGE_DIR="deploy_stage"
ARCHIVE_NAME="deploy_$(date +%Y%m%d_%H%M%S).zip"

echo "==> Building the app (npm run build)"
npm run build

echo "==> Preparing staging directory: $STAGE_DIR"
rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR"

# Everything app-related is grouped under app/ on the server; docker-compose.yml
# stays at the top level (REMOTE_DIR) alongside it, using build context ./app.
APP_DIR="$STAGE_DIR/app"

echo "==> Copying build output"
mkdir -p "$APP_DIR/.next"
cp -r .next/standalone "$APP_DIR/.next/standalone"
cp -r .next/static "$APP_DIR/.next/static"
cp -r public "$APP_DIR/public"

echo "==> Copying Prisma schema/seed/config + full node_modules (Prisma CLI's dependency tree isn't worth curating by hand)"
cp -r prisma "$APP_DIR/prisma"
cp prisma.config.ts "$APP_DIR/prisma.config.ts"
cp -r node_modules "$APP_DIR/node_modules"

echo "==> Copying app-side deploy files (Dockerfile, entrypoint, env)"
cp Dockerfile "$APP_DIR/Dockerfile"
cp docker-entrypoint.sh "$APP_DIR/docker-entrypoint.sh"
cp .dockerignore "$APP_DIR/.dockerignore"
[ -f .env.production ] && cp .env.production "$APP_DIR/.env.production"
[ -f .env.production.example ] && cp .env.production.example "$APP_DIR/.env.production.example"

echo "==> Copying docker-compose.yml (stays outside app/)"
cp docker-compose.yml "$STAGE_DIR/docker-compose.yml"

# -y stores symlinks as symlinks instead of flattening them into copies (Next's
# standalone output has one pointing back into its own node_modules).
echo "==> Zipping into $ARCHIVE_NAME"
(cd "$STAGE_DIR" && zip -rqy "../$ARCHIVE_NAME" .)

rm -rf "$STAGE_DIR"

echo "==> Built $ARCHIVE_NAME, shipping to $SERVER_HOST:$REMOTE_DIR"
ssh "$SERVER_HOST" "mkdir -p $REMOTE_DIR"
scp "$ARCHIVE_NAME" "$SERVER_HOST:$REMOTE_DIR/"

echo "==> Unpacking and starting the stack on $SERVER_HOST"
# Extract into a brand-new temp dir first, then swap it into place — unzip
# refuses to overwrite a path in-place when a symlink and a directory from a
# previous run land on the same path, so extracting where nothing pre-exists
# sidesteps that entirely. data/ and npm/ are untouched.
ssh "$SERVER_HOST" "cd $REMOTE_DIR && TMP=\$(mktemp -d) && unzip -oq $ARCHIVE_NAME -d \"\$TMP\" && rm -rf app docker-compose.yml && mv \"\$TMP\"/app ./app && mv \"\$TMP\"/docker-compose.yml ./docker-compose.yml && rm -rf \"\$TMP\" $ARCHIVE_NAME && docker compose down && docker compose up -d --build"

rm "$ARCHIVE_NAME"

echo "==> Deploy complete."
echo "Note: $REMOTE_DIR/data/dev.db must exist on the server (bind-mounted DB) before the app can start correctly."
