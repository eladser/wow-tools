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
  // Exclude API routes from static generation since we're using client-side calls
  exportPathMap: async function (defaultPathMap) {
    const paths = {}
    // Only include actual pages, not API routes
    const pagesToInclude = ['/', '/logs', '/mythic-plus']
    
    pagesToInclude.forEach(page => {
      paths[page] = { page }
    })
    
    return paths
  },
};

module.exports = nextConfig;
