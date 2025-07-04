FROM openjdk:17-slim
WORKDIR /app
ENTRYPOINT ["timeout", "100", "sh", "-c"]
