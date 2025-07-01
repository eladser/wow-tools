/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['assets.raider.io', 'render.worldofwarcraft.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/warcraftlogs/:path*',
        destination: 'https://www.warcraftlogs.com/api/v2/:path*',
      },
      {
        source: '/api/raiderio/:path*',
        destination: 'https://raider.io/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
