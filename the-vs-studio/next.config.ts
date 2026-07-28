import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Native SQLite binding used by the local response store / desktop path.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
