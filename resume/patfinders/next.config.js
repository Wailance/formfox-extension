const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }]
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp"]
  }
};

module.exports = withPWA(nextConfig);
