const { PHASE_EXPORT } = require('next/constants')

/** @type {import('next').NextConfig | ((phase: string) => import('next').NextConfig)} */
module.exports = (phase) => {
  const isExport = phase === PHASE_EXPORT

  return {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    output: 'standalone',
    trailingSlash: false,
    images: {
      domains: ['localhost', 'supabase.co', 'example.com', 'images.unsplash.com'],
      // Ensure export doesn’t choke on images
      unoptimized: isExport ? true : false,
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    experimental: {
      esmExternals: false,
      optimizeCss: true,
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    // Disable headers/rewrites during export (unsupported by next export)
    ...(isExport
      ? {}
      : {
          async headers() {
            return [
              {
                source: '/(.*)',
                headers: [
                  { key: 'X-Frame-Options', value: 'DENY' },
                  { key: 'X-Content-Type-Options', value: 'nosniff' },
                  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
                  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
              },
              {
                source: '/api/(.*)',
                headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
              },
            ]
          },
          async rewrites() {
            return [
              {
                source: '/api/:path*',
                destination: '/api/:path*',
              },
            ]
          },
        }),
  }
}
