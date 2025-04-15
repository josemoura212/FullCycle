#!/bin/sh

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Waiting for $host:$port to be available..."

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 2
done

echo "$host:$port is available - running migrations"

# Executar as migrations manualmente
mysql -h "$host" -P "$port" -u root -proot wallet < /app/migrations/001_create_tables.sql

echo "Migrations executed successfully - starting application"

# Executar o comando fornecido (iniciar a aplicação)
exec sh -c "$cmd"
