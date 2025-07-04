FROM node:18-slim
WORKDIR /app
ENTRYPOINT ["timeout", "60", "sh", "-c"]

