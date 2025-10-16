FROM node:latest AS builder

 
WORKDIR /app

 
RUN npm install -g pnpm

 
COPY package.json pnpm-lock.yaml* ./

 
RUN pnpm install

 COPY . .

 
RUN pnpm build
FROM node:latest AS runner

WORKDIR /app

 
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

 
EXPOSE 3000

 
CMD ["pnpm", "start"]