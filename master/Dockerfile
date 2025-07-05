FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build



# 🚀 Production Stage
FROM node:18-slim AS production

WORKDIR /app

# Only copy built files and runtime deps
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

COPY .env ./

EXPOSE 5000

CMD ["node", "dist/index.js"]