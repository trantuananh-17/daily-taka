import type { NextConfig } from "next"

/** Admin app is isolated — do not set turbopack.root to monorepo (pulls backend dotenv into Edge). */
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
