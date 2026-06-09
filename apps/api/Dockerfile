FROM node:20-alpine AS base

# Instalar dependências
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Gerar Prisma
FROM deps AS prisma
RUN npx prisma generate

# Build
FROM deps AS builder
WORKDIR /app
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY . .
RUN npm run build

# Produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 feirinha

COPY --from=builder --chown=feirinha:nodejs /app/dist ./dist
COPY --from=builder --chown=feirinha:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=feirinha:nodejs /app/package.json ./

USER feirinha

EXPOSE 3001

CMD ["node", "dist/index.js"]
