/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Next.js image handling. We keep unoptimized images for
  // simplicity but allow remote images from Cloudinary when using
  // next/image in the future. Remote patterns grant permission to
  // load images from res.cloudinary.com. Leaving unoptimized: true
  // ensures the build doesn’t run sharp or other optimizations.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;