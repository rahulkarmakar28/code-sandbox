FROM python:3.10-slim
WORKDIR /app
ENTRYPOINT ["timeout", "100", "sh", "-c"]
