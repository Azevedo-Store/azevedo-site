# Dockerfile para o azevedo-site
# Next.js 16 + React 19 + Prisma 6

FROM node:20-alpine AS deps
# Instalar dependências necessárias para Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências do estágio anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis de ambiente necessárias para build do Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Build do Next.js
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS runner

WORKDIR /app

# Adicionar openssl para Prisma
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários do build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Alterar ownership para o usuário nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expor porta
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
