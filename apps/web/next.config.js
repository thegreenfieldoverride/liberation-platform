/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for easy deployment
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  // Enable experimental features for better performance
  experimental: {
    // optimizeCss: true, // Disabled due to critters dependency issue
    optimizePackageImports: ['@greenfield/runway-calculator', '@greenfield/real-hourly-wage', '@greenfield/cognitive-debt-assessment', '@greenfield/ai-copilot'],
    turbo: {
      rules: {
        // Handle .node files by ignoring them in browser builds
        '*.node': {
          loaders: ['ignore-loader'],
          as: '*.js'
        }
      },
      // resolveAlias handled by webpack fallback
      resolveAlias: {},
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    },
  },
  // Optimize for the liberation mission
  poweredByHeader: false,
  reactStrictMode: true,
  // Transpile workspace packages
  transpilePackages: [
    '@greenfield/runway-calculator', 
    '@greenfield/real-hourly-wage',
    '@greenfield/cognitive-debt-assessment',
    '@greenfield/ai-copilot',
    '@greenfield/types'
  ],
  
  // Minimal webpack config as fallback (when not using Turbopack)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Basic fallbacks for browser builds
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
      
      // Simple aliases for problematic modules
      config.resolve.alias = {
        ...config.resolve.alias,
        'onnxruntime-node': false,
        'sharp': false,
        'canvas': false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;