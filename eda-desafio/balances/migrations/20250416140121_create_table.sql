CREATE TABLE balances (
    account_id VARCHAR PRIMARY KEY,
    balance float NOT NULL,
    created_at TIMESTAMP DEFAULT (timezone('America/Sao_Paulo', now())) NOT NULL,
    updated_at TIMESTAMP DEFAULT (timezone('America/Sao_Paulo', now())) NOT NULL
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('America/Sao_Paulo', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON balances
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();