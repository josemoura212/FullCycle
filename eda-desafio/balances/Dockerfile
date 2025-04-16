# Use a imagem oficial do Rust como base
FROM rust:latest AS builder

# Configure o diretório de trabalho
WORKDIR /app

# Copie os arquivos do projeto para o container
COPY . .

# Instale o sqlx-cli no estágio de build
RUN cargo install sqlx-cli --no-default-features --features postgres

# Copie as migrações para o container
COPY ./migrations ./migrations

# Compile o projeto em modo release
RUN cargo build --release

# Use uma imagem mínima para o runtime
FROM debian:stable-slim

# Instale as dependências necessárias
RUN apt-get update && apt-get install -y libpq-dev && rm -rf /var/lib/apt/lists/*

# Configure o diretório de trabalho
WORKDIR /app

# Copie o binário compilado do estágio anterior
COPY --from=builder /app/target/release/balances /app/balances

# Exponha a porta do serviço
EXPOSE 3003

# Execute as migrações antes de iniciar o serviço
CMD ["sh", "-c", "./balances && sqlx migrate run --database-url postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB"]
