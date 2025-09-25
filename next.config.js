/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    COLLEGE_SCORECARD_API_KEY: process.env.COLLEGE_SCORECARD_API_KEY,
    FEDERAL_AID_API_KEY: process.env.FEDERAL_AID_API_KEY,
    CAREERONESTOP_API_KEY: process.env.CAREERONESTOP_API_KEY,
    OLLAMA_HOST: process.env.OLLAMA_HOST,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL,
  },
}

module.exports = nextConfig