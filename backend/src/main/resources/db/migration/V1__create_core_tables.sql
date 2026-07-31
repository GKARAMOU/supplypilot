CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(140) NOT NULL,
    sku VARCHAR(40) NOT NULL UNIQUE,
    category VARCHAR(60) NOT NULL,
    stock INTEGER NOT NULL CHECK (stock >= 0),
    reorder_level INTEGER NOT NULL CHECK (reorder_level > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    supplier VARCHAR(140) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE suppliers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(255),
    lead_time VARCHAR(255)
);

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL
);

CREATE TABLE purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    supplier VARCHAR(255) NOT NULL,
    total_units INTEGER NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
