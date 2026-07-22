import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker: bundles a minimal server + traced node_modules into .next/standalone.
  output: "standalone",
  // Keep the native SQLite driver out of the bundler — it's used only on the server.
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
  // Let the dev server (incl. HMR websocket) be reached from any host.
  // Next rejects a bare "*"; "**.*" matches every dotted hostname/IP,
  // and localhost/*.localhost are allowed by default.
  allowedDevOrigins: ["**.*"],
  // Open CORS on every route: any origin, any method.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
          },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
