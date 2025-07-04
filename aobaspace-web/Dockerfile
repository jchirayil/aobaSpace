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

# Copy the entire standalone output from the builder stage.
# This includes the Next.js server, node_modules, and the .next/static assets.
COPY --from=builder /app/.next/standalone ./

# Copy the original public directory.
# While standalone might include some public assets, copying the original ensures
# all static assets (like favicon.ico, images, etc.) are present.
COPY --from=builder /app/public ./public

# NEW: Copy the 'content' directory.
# This is essential for your Markdown files to be accessible at runtime.
COPY --from=builder /app/content ./content

EXPOSE 3000

# The standalone server is run via node server.js from its root.
CMD ["node", "server.js"]