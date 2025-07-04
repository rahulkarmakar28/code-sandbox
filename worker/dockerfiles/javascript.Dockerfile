FROM node:18-slim
WORKDIR /app
ENTRYPOINT ["timeout", "100", "sh", "-c"]

