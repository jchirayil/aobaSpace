# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* pnpm-lock.yaml* ./
# Use npm, yarn, or pnpm based on your preference
RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

# Stage 2: Run the Next.js application
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy the standalone output from the builder stage
# The standalone output includes the server, .next, and node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

# Copy built application from builder stage
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/public ./public

EXPOSE 3000

# The standalone server is run via node server.js from its root.
CMD ["node", "server.js"]

# CMD ["npm", "start"]
