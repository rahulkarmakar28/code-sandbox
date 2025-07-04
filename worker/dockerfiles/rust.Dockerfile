FROM rust:1.73
WORKDIR /app
ENTRYPOINT ["timeout", "120", "sh", "-c"]
