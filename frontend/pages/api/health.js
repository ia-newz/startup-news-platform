export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      frontend: 'operational',
      backend: process.env.NEXT_PUBLIC_FEED_SERVICE_URL ? 'configured' : 'not_configured'
    }
  }

  res.status(200).json(health)
}
