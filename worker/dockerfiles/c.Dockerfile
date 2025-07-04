FROM gcc:12
WORKDIR /app
ENTRYPOINT ["timeout", "120", "sh", "-c"]