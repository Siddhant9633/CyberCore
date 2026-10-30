import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Keep preview resolution rooted in the Next app, not the repository shell. */
  turbopack: {
    root: path.resolve(__dirname),
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
