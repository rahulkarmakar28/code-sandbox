FROM node:18-slim
WORKDIR /app
RUN npm install -g typescript
ENTRYPOINT ["timeout", "80", "sh", "-c"]