FROM golang:1.21
WORKDIR /app
ENTRYPOINT ["timeout", "100", "sh", "-c"]
