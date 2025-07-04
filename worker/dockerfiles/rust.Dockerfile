FROM rust:1.73
WORKDIR /app
ENTRYPOINT ["timeout", "80", "sh", "-c"]
