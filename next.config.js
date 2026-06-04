/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");

/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",   value: "on" },
  { key: "X-Frame-Options",          value: "SAMEORIGIN" },          // prevent clickjacking
  { key: "X-Content-Type-Options",   value: "nosniff" },             // prevent MIME sniffing
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security",value: "max-age=63072000; includeSubDomains; preload" }, // HSTS
];

const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@mux/mux-video/base": path.resolve(__dirname, "node_modules/@mux/mux-video/dist/base.cjs.js"),
      "@mux/mux-video$": path.resolve(__dirname, "node_modules/@mux/mux-video/dist/index.cjs.js"),
      "@mux/mux-player$": path.resolve(__dirname, "node_modules/@mux/mux-player/dist/index.cjs.js"),
      "@mux/playback-core": path.resolve(__dirname, "node_modules/@mux/playback-core/dist/index.cjs.js"),
      "@reduxjs/toolkit": path.resolve(__dirname, "node_modules/@reduxjs/toolkit/dist/cjs/index.js"),
    };
    return config;
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kreostudio.co.uk" }],
        destination: "https://www.kreostudio.co.uk/:path*",
        permanent: true,
      },
      {
        source: "/projects/ocean-pollution/GDES464_Brandon_Allen_Workbook.pdf",
        destination: "/projects/ocean-pollution/workbook/index.html",
        permanent: false,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
