import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // PRD §7.3: old URLs from the current site and v2 drafts
  async redirects() {
    return [
      { source: "/whyChoose", destination: "/how-it-works", permanent: true },
      { source: "/journey", destination: "/roadmap", permanent: true },
      { source: "/career", destination: "/careers", permanent: true },
      { source: "/compatibility", destination: "/products", permanent: true },
      { source: "/features", destination: "/app", permanent: true },
      { source: "/waitlist", destination: "/book-survey", permanent: true },
      { source: "/partners", destination: "/solutions", permanent: true },
    ];
  },

  // PRD §12.4 (CSP is added once analytics and form endpoints are final)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
