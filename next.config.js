/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Ensure CSS is properly loaded
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    COLLEGE_SCORECARD_API_KEY: process.env.COLLEGE_SCORECARD_API_KEY,
    CAREERONESTOP_API_KEY: process.env.CAREERONESTOP_API_KEY,
    CAREERONESTOP_USER_ID: process.env.CAREERONESTOP_USER_ID,
    OLLAMA_API_URL: process.env.OLLAMA_API_URL || 'http://localhost:11434',
  },
  
  // Headers for API calls
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
  
  // Rewrites for API proxying if needed
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;