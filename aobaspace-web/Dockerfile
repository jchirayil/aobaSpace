# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copy package.json and lock files first
COPY package.json yarn.lock* pnpm-lock.yaml* ./

# 2. Install dependencies based on the lock file
RUN npm install --frozen-lockfile

# 3. Copy the rest of your application code
# This ensures that node_modules and .next from the host are NOT copied
# which could cause conflicts with the fresh install in the container.
COPY . .

# 4. Run the build
RUN npm run build

# Stage 2: Run the Next.js application
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy the entire standalone output (server.js, node_modules)
COPY --from=builder /app/.next/standalone ./

# Corrected: Copy .next/static from the builder's .next directory
COPY --from=builder /app/.next/static ./.next/static

# Corrected: Copy public from the builder's root directory
COPY --from=builder /app/public ./public

# Copy the 'content' directory.
# This is essential for your Markdown files to be accessible at runtime.
COPY --from=builder /app/content ./content

EXPOSE 3000

# The standalone server is run via node server.js from its root.
CMD ["node", "server.js"]