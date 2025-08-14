# Production-grade Next.js Dockerfile (standalone)

# 1) Install deps
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build Next.js (produces .next/standalone when output: 'standalone')
RUN npm run build

# 3) Runtime (smallest)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Only copy what we need to run the server
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/ ./.next

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
