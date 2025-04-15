FROM golang:latest

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Instalar dependências do sistema, incluindo netcat
RUN apt-get update && apt-get install -y librdkafka-dev netcat-openbsd

# Copiar o script wait-for.sh
COPY wait-for.sh /app/wait-for.sh
RUN chmod +x /app/wait-for.sh

RUN go build -o walletcore ./cmd/walletcore/main.go

ENTRYPOINT ["/app/wait-for.sh", "mysql", "3306", "./walletcore"]