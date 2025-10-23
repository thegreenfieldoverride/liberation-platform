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
  swcMinify: true,
  
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