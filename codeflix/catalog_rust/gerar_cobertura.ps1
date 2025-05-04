# Passo 1: limpar relatório antigo
Remove-Item tarpaulin-report.html -Force -ErrorAction SilentlyContinue

# Passo 2: rodar tarpaulin ignorando main.rs
cargo tarpaulin --out Html --exclude-files src/main.rs

# Passo 3: abrir o relatório
if (Test-Path "tarpaulin-report.html") {
    Start-Process "tarpaulin-report.html"
} else {
    Write-Host "❌ Erro: O relatório tarpaulin-report.html não foi encontrado."
}
