-- V1__create-base-schema.sql

-- Table for associations
CREATE TABLE associations (
    uuid BINARY(16) PRIMARY KEY,
    association_name VARCHAR(255) UNIQUE NOT NULL,
    principal_name VARCHAR(255) NOT NULL,
    association_key VARCHAR(255) UNIQUE NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for customers
CREATE TABLE customers (
    uuid BINARY(16) PRIMARY KEY,
    card_id CHAR(15) NOT NULL,
    customer_start TIMESTAMP NOT NULL,
    customer_end TIMESTAMP,
    in_use TINYINT NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for donations
CREATE TABLE donations (
    uuid BINARY(16) PRIMARY KEY,
    donation_value DECIMAL(19, 2) NOT NULL,
    donation_timestamp TIMESTAMP NOT NULL,
    customer_uuid BINARY(16) NOT NULL,
    register_uuid binary(16) NOT NULL,
    voluntary_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for functions
CREATE TABLE functions (
    uuid BINARY(16) PRIMARY KEY,
    function_name VARCHAR(255) UNIQUE NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for items
CREATE TABLE items (
    purchase_uuid BINARY(16),
    product_uuid BINARY(16),
    quantity INT NOT NULL,
    delivered INT,
    unit_price DECIMAL(19, 2) NOT NULL,
    discount DECIMAL(19, 2) NOT NULL,
    valid TINYINT NOT NULL,
    PRIMARY KEY (product_uuid, purchase_uuid)
);

-- Table for order_cards
CREATE TABLE order_cards (
    card_id CHAR(15) PRIMARY KEY,
    debit DECIMAL(19, 2) NOT NULL,
    active TINYINT NOT NULL
);

-- Table for products
CREATE TABLE products (
    uuid BINARY(16) PRIMARY KEY,
    product_name VARCHAR(255) UNIQUE NOT NULL,
    product_code INT NOT NULL,
    summary VARCHAR(255),
    description TEXT,
    combo TINYINT NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    discount DECIMAL(19, 2) NOT NULL,
    stock INT,
    product_img VARCHAR(255),
    stand_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for product_combos
CREATE TABLE product_combos (
    product_combo_uuid BINARY(16),
    product_included_uuid BINARY(16),
    quantity INT NOT NULL,
    PRIMARY KEY (product_combo_uuid, product_included_uuid)
);

-- Table for purchases
CREATE TABLE purchases (
    uuid BINARY(16) PRIMARY KEY,
    on_order TINYINT NOT NULL,
    purchase_timestamp TIMESTAMP NOT NULL,
    stand_uuid BINARY(16) NOT NULL,
    customer_uuid BINARY(16) NOT NULL,
    voluntary_uuid BINARY(16) NOT NULL,
    reversal TINYINT NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for recharges
CREATE TABLE recharges (
    uuid BINARY(16) PRIMARY KEY,
    recharge_value DECIMAL(19, 2) NOT NULL,
    payment_type ENUM('CASH', 'CREDIT', 'DEBIT', 'PIX') NOT NULL,
    recharge_timestamp TIMESTAMP NOT NULL,
    customer_uuid BINARY(16) NOT NULL,
    register_uuid binary(16) NOT NULL,
    voluntary_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for refund
CREATE TABLE refunds (
    uuid BINARY(16) PRIMARY KEY,
    refund_value DECIMAL(19, 2) NOT NULL,
    refund_timestamp TIMESTAMP NOT NULL,
    customer_uuid BINARY(16) NOT NULL,
    register_uuid binary(16) NOT NULL,
    voluntary_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for registers
CREATE TABLE registers (
    uuid BINARY(16) PRIMARY KEY,
    stand_uuid BINARY(16) UNIQUE,
    total_cash DECIMAL(19, 2) NOT NULL,
    total_credit DECIMAL(19, 2) NOT NULL,
    total_debit DECIMAL(19, 2) NOT NULL,
    total_pix DECIMAL(19, 2) NOT NULL
);

-- Table for stands
CREATE TABLE stands (
    uuid BINARY(16) PRIMARY KEY,
    association_uuid BINARY(16) NOT NULL
);

-- Table for tags
CREATE TABLE tags (
    uuid BINARY(16) PRIMARY KEY,
    tag_name VARCHAR(255) UNIQUE NOT NULL,
    color CHAR(7)
);

-- Table for tag_products
CREATE TABLE tag_products (
    tag_uuid BINARY(16),
    product_uuid BINARY(16),
    PRIMARY KEY (tag_uuid, product_uuid)
);

-- Table for trades
CREATE TABLE trades (
    uuid BINARY(16) PRIMARY KEY,
    recharge_uuid BINARY(16) NOT NULL,
    purchase_uuid BINARY(16) NOT NULL,
    trade_timestamp TIMESTAMP NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for transactions
CREATE TABLE transactions (
    uuid BINARY(16) PRIMARY KEY,
    amount DECIMAL(19, 2) NOT NULL,
    transaction_type ENUM('ENTRY', 'EXIT') NOT NULL,
    transaction_timestamp TIMESTAMP NOT NULL,
    register_uuid binary(16) NOT NULL,
    voluntary_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for volunteers
CREATE TABLE volunteers (
    uuid BINARY(16) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) UNIQUE NOT NULL,
    function_uuid BINARY(16),
    related_association_uuid BINARY(16),
    voluntary_role ENUM('ROLE_VOLUNTARY', 'ROLE_MANAGEMENT', 'ROLE_ADMIN') NOT NULL,
    valid TINYINT NOT NULL
);
