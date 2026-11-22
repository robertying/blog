FROM node:lts-alpine AS base

# Node 25+ no longer bundles corepack, so install it explicitly. Only the stages
# that run pnpm build on this; the runner stays on plain base.
FROM base AS tooling
RUN npm install -g corepack && corepack enable

FROM tooling AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack install && pnpm install --frozen-lockfile

# Builds on deps to reuse node_modules and the pnpm download.
FROM deps AS builder

ENV NEXT_TELEMETRY_DISABLED=1

COPY . .

RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# The runtime only needs node, so drop the bundled npm.
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
