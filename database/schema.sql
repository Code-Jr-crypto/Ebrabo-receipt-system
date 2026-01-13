CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    id_type VARCHAR(20),
    id_number VARCHAR(100),
    mobile VARCHAR(30),
    address TEXT,
    vrn VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE receipts (
    id SERIAL PRIMARY KEY,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    receipt_code VARCHAR(100) UNIQUE NOT NULL,
    subtotal NUMERIC(14,2),
    vat NUMERIC(14,2),
    total NUMERIC(14,2),
    receipt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE receipt_items (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER REFERENCES receipts(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC(10,2) NOT NULL,
    unit_price NUMERIC(14,2) NOT NULL,
    total NUMERIC(14,2) NOT NULL
);
