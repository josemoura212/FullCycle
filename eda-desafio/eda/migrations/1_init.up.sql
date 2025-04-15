USE wallet;

CREATE TABLE clients (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    id CHAR(36) NOT NULL PRIMARY KEY,
    client_id CHAR(36) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE transactions (
    id CHAR(36) NOT NULL PRIMARY KEY,
    account_id CHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

INSERT INTO clients (id, name, email, created_at) VALUES
('1', 'Client One', 'client1@example.com', NOW()),
('2', 'Client Two', 'client2@example.com', NOW()),
('3', 'Client Three', 'client3@example.com', NOW());

INSERT INTO accounts (id, client_id, balance, created_at) VALUES
('1', '1', 1000.00, NOW()),
('2', '2', 1000.00, NOW()),
('3', '3', 1000.00, NOW());


