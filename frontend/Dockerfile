# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine AS base

# Install dependencies needed for native modules
RUN apk add --no-cache libc6-compat

# Upgrade npm to latest LTS CLI to reduce deprecation warnings
RUN npm i -g npm@11.5.2

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install dependencies needed for native modules
RUN apk add --no-cache libc6-compat

# Upgrade npm to latest LTS CLI to reduce deprecation warnings
RUN npm i -g npm@11.5.2

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy node_modules from build stage (this avoids npm ci issues)
COPY --from=base /app/node_modules ./node_modules

# Copy built application from build stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["npm", "start"]
