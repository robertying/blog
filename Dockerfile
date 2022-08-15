FROM node:18-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat curl && \
    curl -fsSL https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64 -o /bin/pnpm && \
    chmod +x /bin/pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV TZ America/Los_Angeles
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache curl && \
    curl -fsSL https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64 -o /bin/pnpm && \
    chmod +x /bin/pnpm
RUN pnpm build
RUN node optimizeImages.mjs


FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
