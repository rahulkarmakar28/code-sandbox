FROM golang:1.21
WORKDIR /app
ENTRYPOINT ["timeout", "150", "sh", "-c"]
