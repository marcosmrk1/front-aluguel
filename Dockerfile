# Etapa 1 — Build
FROM node:20 AS builder
WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm

# Copia arquivos de lock e package
COPY package.json pnpm-lock.yaml* ./

# Instala dependências
RUN pnpm install

# Copia todo o projeto
COPY . .

# Build Next.js
RUN pnpm build

# Etapa 2 — Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Instala pnpm no runner também (necessário para 'pnpm start')
RUN npm install -g pnpm

# Copia artefatos gerados no builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["pnpm", "start"]
# ...existing code...