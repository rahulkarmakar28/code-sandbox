FROM openjdk:17-slim
WORKDIR /app
ENTRYPOINT ["timeout", "130", "sh", "-c"]
