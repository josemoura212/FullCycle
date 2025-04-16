FROM rust:latest AS base

WORKDIR /app

RUN apt update && apt install -y lld clang libpq-dev openssl ca-certificates \
    && cargo install sqlx-cli --no-default-features --features postgres \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

COPY . .

COPY ./migrations ./migrations

ENV SQLX_OFFLINE=true

RUN cargo build --release --bin balances

RUN cp ./target/release/balances /app/balances

EXPOSE 3003


# CMD ["sh", "-c", "sqlx migrate run --database-url $DATABASE_URL && ./balances"]
CMD ["tail", "-f", "/dev/null"]
