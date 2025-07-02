# Stage 1: Build the NestJS application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* pnpm-lock.yaml* ./
# Use npm, yarn, or pnpm based on your preference
RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

# Stage 2: Run the NestJS application
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh
# CHANGED: Added postgresql-client for pg_isready
RUN apk add --no-cache netcat-openbsd bash postgresql-client 

EXPOSE 3000

CMD ["node", "dist/main"]