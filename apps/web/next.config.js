/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone for Docker, static export for CDN deployments
  ...(process.env.DEPLOYMENT_TARGET === 'docker' && {
    output: 'standalone',
  }),
  ...(process.env.DEPLOYMENT_TARGET === 'static' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
  
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Transpile workspace packages
  transpilePackages: [
    '@greenfieldoverride/runway-calculator', 
    '@greenfieldoverride/real-hourly-wage',
    '@greenfieldoverride/cognitive-debt-assessment',
    '@greenfieldoverride/ai-copilot',
    '@greenfieldoverride/types',
    '@greenfieldoverride/user-context',
    '@greenfieldoverride/small-bets-portfolio',
    '@greenfieldoverride/values-vocation-matcher'
  ],
  
  // The Small Bets PWA is copied into public/small-bets at build time. Next
  // serves files from public/ but does not resolve a directory to its
  // index.html, so /small-bets would 404 without this. skipTrailingSlashRedirect
  // keeps /small-bets/ intact rather than bouncing it to /small-bets, which
  // would land outside the service worker's /small-bets/ scope.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      { source: '/small-bets', destination: '/small-bets/index.html' },
      { source: '/small-bets/', destination: '/small-bets/index.html' },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;