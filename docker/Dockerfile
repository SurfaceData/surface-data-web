# Install Dependencies and Build only when needed.

# Node Alpine works best with libc6-compat installed.
FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy over the files and do the installing & building.
COPY web .
RUN npm ci
RUN npm run lang:compile
RUN npm run build

# Production image, copy all the files and run next.
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Setup users.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy over critical files.
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch user and run.
USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
