import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the native SQLite driver out of the bundler — it's used only on the server.
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
};

export default nextConfig;
