/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone for Docker, static export for CDN deployments
  ...(process.env.DEPLOYMENT_TARGET === 'docker' && {
    output: 'standalone',
    // The static target disabled image optimization as a side effect of
    // `output: 'export'`; the docker target never did, so production has been
    // serving a live /_next/image endpoint this whole time. That endpoint is
    // the one reachable surface for GHSA-2xp9-vwfh-vxw4, an unauthenticated
    // RCE in image optimization. Turning it off removes the endpoint outright
    // rather than arguing it is unreachable.
    //
    // Exactly one component imports next/image: MariposaLogo, a local PNG in
    // the nav at 32px. It was a 6000x6000, 1.1MB source that optimization had
    // been quietly resizing on every request — and it is marked `priority`, so
    // disabling optimization without touching it would have preloaded 1.1MB on
    // every page. The asset is now 128x128 / 5.9KB, which covers 32px at 4x and
    // the component's 40px default at 3x, so serving it unoptimized costs
    // nothing.
    images: {
      unoptimized: true,
    },
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