/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: ['assets.raider.io', 'render.worldofwarcraft.com'],
  },
  env: {
    WARCRAFTLOGS_CLIENT_ID: process.env.WARCRAFTLOGS_CLIENT_ID,
    WARCRAFTLOGS_CLIENT_SECRET: process.env.WARCRAFTLOGS_CLIENT_SECRET,
  },
  // GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/wow-tools' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/wow-tools/' : '',
};

module.exports = nextConfig;
