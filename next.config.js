/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Removed 'output: export' to enable API routes
  // output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Removed distDir for normal Next.js build
  // distDir: 'out',
  images: {
    unoptimized: true,
    domains: ['assets.raider.io', 'render.worldofwarcraft.com'],
  },
  env: {
    WARCRAFTLOGS_CLIENT_ID: process.env.WARCRAFTLOGS_CLIENT_ID,
    WARCRAFTLOGS_CLIENT_SECRET: process.env.WARCRAFTLOGS_CLIENT_SECRET,
  },
  // Removed basePath and assetPrefix for normal deployment
  // basePath: process.env.NODE_ENV === 'production' ? '/wow-tools' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/wow-tools/' : '',
};

module.exports = nextConfig;
