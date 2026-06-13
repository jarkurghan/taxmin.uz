# Stage 1: dependencies
FROM oven/bun:1.3-alpine AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Stage 2: build
FROM oven/bun:1.3-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* o'zgaruvchilar build vaqtida JS ichiga "baked in" bo'ladi
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BOT_USERNAME
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_MINIAPP_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BOT_USERNAME=$NEXT_PUBLIC_BOT_USERNAME
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_MINIAPP_URL=$NEXT_PUBLIC_MINIAPP_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

# Stage 3: runner (standalone — minimal image)
FROM oven/bun:1.3-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["bun", "server.js"]
