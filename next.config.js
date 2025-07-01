/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static export only for GitHub Pages deployment
  ...(process.env.GITHUB_ACTIONS && process.env.NODE_ENV === 'production' ? {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'out',
    basePath: '/wow-tools',
    assetPrefix: '/wow-tools/',
  } : {}),
  images: {
    unoptimized: true,
    domains: ['assets.raider.io', 'render.worldofwarcraft.com'],
  },
  env: {
    WARCRAFTLOGS_CLIENT_ID: process.env.WARCRAFTLOGS_CLIENT_ID,
    WARCRAFTLOGS_CLIENT_SECRET: process.env.WARCRAFTLOGS_CLIENT_SECRET,
  },
};

module.exports = nextConfig;
