FROM golang:latest

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Copiar o script wait-for.sh
COPY wait-for.sh /app/wait-for.sh
RUN chmod +x /app/wait-for.sh

RUN apt-get update && apt-get install -y librdkafka-dev

RUN go build -o walletcore ./cmd/walletcore/main.go

ENTRYPOINT ["/app/wait-for.sh", "mysql", "3306", "./walletcore"]