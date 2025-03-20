-- V1__create-base-schema.sql

-- Table for associations
CREATE TABLE associations (
    uuid BINARY(16) PRIMARY KEY,
    association_name VARCHAR(255) UNIQUE NOT NULL,
    principal_name VARCHAR(255) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for cash_registers
CREATE TABLE cash_registers (
    uuid BINARY(16) PRIMARY KEY,
    cash_total DECIMAL(19, 2) NOT NULL,
    credit_total DECIMAL(19, 2) NOT NULL,
    debit_total DECIMAL(19, 2) NOT NULL
);

-- Table for customers
CREATE TABLE customers (
    uuid BINARY(16) PRIMARY KEY,
    order_card_id CHAR(15) NOT NULL,
    customer_start TIMESTAMP NOT NULL,
    customer_end TIMESTAMP,
    in_use TINYINT NOT NULL
);

-- Table for donations
CREATE TABLE donations (
    uuid BINARY(16) PRIMARY KEY,
    donation_value DECIMAL(19, 2) NOT NULL,
    donation_time_stamp TIMESTAMP NOT NULL,
    customer_uuid BINARY(16) NOT NULL,
    cash_register_uuid binary(16) NOT NULL,
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
    product_uuid BINARY(16),
    purchase_uuid BINARY(16),
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
    summary VARCHAR(255),
    description TEXT,
    price DECIMAL(19, 2) NOT NULL,
    discount DECIMAL(19, 2) NOT NULL,
    stock INT NOT NULL,
    product_img VARCHAR(255),
    stand_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for purchases
CREATE TABLE purchases (
    uuid BINARY(16) PRIMARY KEY,
    on_order BOOLEAN NOT NULL,
    purchase_time_stamp TIMESTAMP NOT NULL,
    customer_uuid BINARY(16) NOT NULL,
    voluntary_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for recharges
CREATE TABLE recharges (
    uuid BINARY(16) PRIMARY KEY,
    recharge_value DECIMAL(19, 2) NOT NULL,
    payment_type ENUM('CREDIT', 'DEBIT', 'CASH') NOT NULL,
    recharge_time_stamp TIMESTAMP NOT NULL,
    customer_uuid BINARY(16) NOT NULL,
    cash_register_uuid binary(16) NOT NULL,
    voluntary_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for refund
CREATE TABLE refunds (
    uuid BINARY(16) PRIMARY KEY,
    refund_value DECIMAL(19, 2) NOT NULL,
    refund_time_stamp TIMESTAMP NOT NULL,
    customer_uuid BINARY(16) NOT NULL,
    cash_register_uuid binary(16) NOT NULL,
    voluntary_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for stands
CREATE TABLE stands (
    uuid BINARY(16) PRIMARY KEY,
    association_uuid BINARY(16) NOT NULL
);

-- Table for transactions
CREATE TABLE transactions (
    uuid BINARY(16) PRIMARY KEY,
    amount DECIMAL(19, 2) NOT NULL,
    transaction_type ENUM('ENTRY', 'EXIT') NOT NULL,
    transaction_time_stamp TIMESTAMP NOT NULL,
    cash_register_uuid binary(16) NOT NULL,
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
    voluntary_role ENUM('ROLE_USER', 'ROLE_MANAGEMENT', 'ROLE_ADMIN') NOT NULL,
    valid TINYINT NOT NULL
);
