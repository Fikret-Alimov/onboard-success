import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old site URLs (Wix-era) → new equivalents
      { source: "/blog", destination: "/playbooks", permanent: true },
      { source: "/resources", destination: "/playbooks", permanent: true },
      { source: "/about-fikret", destination: "/", permanent: true },
      // Old post-slug URLs → playbooks index (no 1:1 match)
      { source: "/post/:slug*", destination: "/playbooks", permanent: true },
    ];
  },
};

export default nextConfig;
