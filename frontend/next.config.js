/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'supabase.co', 'example.com'],
    unoptimized: true
  },
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig
