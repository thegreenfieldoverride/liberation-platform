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
    '@thegreenfieldoverride/runway-calculator', 
    '@thegreenfieldoverride/real-hourly-wage',
    '@thegreenfieldoverride/cognitive-debt-assessment',
    '@thegreenfieldoverride/ai-copilot',
    '@thegreenfieldoverride/types',
    '@thegreenfieldoverride/user-context',
    '@thegreenfieldoverride/small-bets-portfolio',
    '@thegreenfieldoverride/values-vocation-matcher'
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