FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build  # assumes this runs `tsc` and outputs to /app/dist

# 🚀 Production Stage
FROM node:18-slim AS production

WORKDIR /app

# Only copy built files and runtime deps
COPY package*.json ./
RUN npm install --omit=dev  # install only production dependencies

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]  # or your actual entry point
