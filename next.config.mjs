/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",        // enables static export
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};

export default nextConfig;