/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",          // ✅ This enables static export
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};

export default nextConfig;