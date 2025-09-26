/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['source.unsplash.com', 'cdn-icons-png.flaticon.com', 'images.unsplash.com', 'videos.pexels.com'],
  },
  experimental: {
    allowedDevOrigins: ['192.168.137.1', '*'],
  },
};

module.exports = nextConfig;
