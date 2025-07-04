FROM gcc:12
WORKDIR /app
ENTRYPOINT ["timeout", "80", "sh", "-c"]