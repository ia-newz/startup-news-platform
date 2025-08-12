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

### Option 1: Multi-Stage Production Build (Recommended)

1. **Build Docker Image:**
   ```bash
   docker build -t innovations-arena-frontend .
   ```

2. **Run Container:**
   ```bash
   docker run -p 3000:3000 innovations-arena-frontend
   ```

### Option 2: Simple Single-Stage Build (Fallback)

If the multi-stage build fails, use the simple Dockerfile:

1. **Build with Simple Dockerfile:**
   ```bash
   docker build -f Dockerfile.simple -t innovations-arena-frontend-simple .
   ```

2. **Run Container:**
   ```bash
   docker run -p 3000:3000 innovations-arena-frontend-simple
   ```

### Development Build

1. **Build Development Image:**
   ```bash
   docker build -f Dockerfile.dev -t innovations-arena-frontend:dev .
   ```

2. **Run Development Container:**
   ```bash
   docker run -p 3000:3000 -v $(pwd):/app innovations-arena-frontend:dev
   ```

### Using Docker Compose

1. **Development:**
   ```bash
   docker-compose up frontend-dev
   ```

2. **Production (Multi-stage):**
   ```bash
   docker-compose up frontend-prod
   ```

3. **Production (Simple):**
   ```bash
   docker-compose up frontend-prod-simple
   ```

## Docker Troubleshooting

### Common Build Issues

1. **"npm ci --only=production" Error**
   
   **Problem**: The `npm ci` command fails in the production stage
   
   **Solutions**:
   - Use the simple Dockerfile: `docker build -f Dockerfile.simple .`
   - The multi-stage Dockerfile now copies `node_modules` instead of reinstalling
   - Clear Docker cache: `docker system prune -a`

2. **"process /bin/sh -c npm run build did not complete successfully"**
   
   **Problem**: Build process fails during npm run build
   
   **Solutions**:
   - Ensure sufficient memory: `docker build --memory=4g .`
   - Use the updated multi-stage Dockerfile
   - Test build locally first: `npm run build`

3. **Memory Issues During Build**
   
   **Solution**: Increase Docker memory allocation:
   ```bash
   docker build --memory=4g -t innovations-arena-frontend .
   ```

4. **Node Modules Issues**
   
   **Solution**: Clear Docker cache and rebuild:
   ```bash
   docker system prune -a
   docker build --no-cache -t innovations-arena-frontend .
   ```

### Build Commands

```bash
# Multi-stage build (recommended)
docker build -t innovations-arena-frontend .

# Simple build (fallback)
docker build -f Dockerfile.simple -t innovations-arena-frontend-simple .

# Clean build (recommended for production)
docker build --no-cache -t innovations-arena-frontend .

# Build with specific platform
docker build --platform linux/amd64 -t innovations-arena-frontend .

# Build with build arguments
docker build --build-arg NODE_ENV=production -t innovations-arena-frontend .
```

### Docker Debugging

```bash
# Check container logs
docker logs <container_id>

# Enter running container
docker exec -it <container_id> /bin/sh

# Check container resources
docker stats <container_id>

# Inspect container
docker inspect <container_id>

# Check build context
docker build --progress=plain -t innovations-arena-frontend .
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
   - Use the fixed multi-stage Dockerfile or simple Dockerfile
   - Test build locally first with `npm run build`

2. **Runtime Errors:**
   - Verify backend services are accessible
   - Check CORS configuration
   - Review browser console for errors

3. **Performance Issues:**
   - Enable image optimization
   - Check bundle size with `npm run build`
   - Monitor Core Web Vitals

4. **Docker Issues:**
   - Ensure sufficient memory allocation
   - Use the updated Dockerfiles
   - Clear Docker cache if needed
   - Check for platform compatibility
   - Try the simple Dockerfile if multi-stage fails

### npm ci Error Specific Solutions:

1. **Use Simple Dockerfile:**
   ```bash
   docker build -f Dockerfile.simple -t innovations-arena-frontend .
   ```

2. **Update npm:**
   ```bash
   npm install -g npm@latest
   ```

3. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

4. **Use npm install instead:**
   ```bash
   # In Dockerfile, replace:
   # RUN npm ci --only=production
   # With:
   RUN npm install --only=production --ignore-scripts
   ```

### Support:

For deployment issues, check:
- Next.js documentation
- Render.com documentation
- Docker documentation
- Environment variable configuration
- Updated Dockerfiles and docker-compose files
- Use the simple Dockerfile as a fallback option
