/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'themechacrew-qcpxkge9e-mygummy.vercel.app'],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
}

module.exports = nextConfig
