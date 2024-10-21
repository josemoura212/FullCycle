FROM golang:alpine AS builder

WORKDIR /usr/src/app

COPY main.go .

RUN go build -o /app main.go

FROM scratch

COPY --from=builder /app /app

CMD ["/app"]
