# Deployment Guide - Innovations Arena Frontend

## Environment Configuration

Create a `.env.local` file in the frontend directory with the following variables:

```bash
# Backend Service URLs
NEXT_PUBLIC_FEED_SERVICE_URL=https://startup-news-feed.onrender.com
NEXT_PUBLIC_CMS_SERVICE_URL=https://startup-news-cms.onrender.com
NEXT_PUBLIC_TIMELINE_SERVICE_URL=https://startup-news-timeline.onrender.com

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id_here
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token_here

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_COMMENTS=false
NEXT_PUBLIC_ENABLE_NEWSLETTER=true

# App Configuration
NEXT_PUBLIC_APP_NAME=Innovations Arena
NEXT_PUBLIC_APP_DESCRIPTION=Latest Startup News & Stories
NEXT_PUBLIC_APP_URL=https://startup-news-frontend.onrender.com
```

## Production Build

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Build for Production:**
   ```bash
   npm run build
   ```

3. **Start Production Server:**
   ```bash
   npm start
   ```

## Docker Deployment

1. **Build Docker Image:**
   ```bash
   docker build -t innovations-arena-frontend .
   ```

2. **Run Container:**
   ```bash
   docker run -p 3000:3000 innovations-arena-frontend
   ```

## Render.com Deployment

1. **Connect Repository:**
   - Connect your GitHub repository to Render
   - Set build command: `npm run build`
   - Set start command: `npm start`

2. **Environment Variables:**
   - Add all required environment variables in Render dashboard
   - Ensure `NODE_ENV=production`

3. **Auto-Deploy:**
   - Enable auto-deploy on push to main branch
   - Set up custom domain if needed

## Performance Optimization

- Images are automatically optimized with WebP/AVIF formats
- CSS is minified and optimized
- Console logs are removed in production
- Security headers are automatically added
- Compression is enabled

## Monitoring

- Health check endpoint: `/api/health`
- Performance monitoring with built-in Next.js analytics
- Error tracking (configure your preferred service)

## Security Features

- XSS protection headers
- Content type sniffing prevention
- Frame options protection
- Permissions policy restrictions
- Secure referrer policy

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Check environment variable configuration

2. **Runtime Errors:**
   - Verify backend services are accessible
   - Check CORS configuration
   - Review browser console for errors

3. **Performance Issues:**
   - Enable image optimization
   - Check bundle size with `npm run build`
   - Monitor Core Web Vitals

### Support:

For deployment issues, check:
- Next.js documentation
- Render.com documentation
- Docker documentation
- Environment variable configuration
