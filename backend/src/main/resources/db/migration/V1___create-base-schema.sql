-- V1__create-base-schema.sql

-- Table for associations
CREATE TABLE associations (
    uuid BINARY(16) PRIMARY KEY,
    association VARCHAR(255) NOT NULL,
    principal_name VARCHAR(255),
    principal_id BINARY(16),
    valid TINYINT(1)
);

-- Table for customers
CREATE TABLE customers (
    uuid BINARY(16) PRIMARY KEY,
    card_id CHAR(15),
    customer_start TIMESTAMP,
    customer_end TIMESTAMP,
    in_use TINYINT(1),
    voluntary_id BINARY(16)
);

-- Table for donations
CREATE TABLE donations (
    uuid BINARY(16) PRIMARY KEY,
    donation_value DECIMAL(19, 2),
    donation_time_stamp TIMESTAMP,
    customer_id BINARY(16),
    voluntary_id BINARY(16),
    valid TINYINT(1)
);

-- Table for goods
CREATE TABLE goods (
    item_id BINARY(16),
    sale_id BINARY(16),
    quantity INT,
    unit_price DECIMAL(19, 2),
    valid TINYINT(1),
    PRIMARY KEY (item_id, sale_id)
);

-- Table for items
CREATE TABLE items (
    uuid BINARY(16) PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    price DECIMAL(19, 2),
    stock INT,
    item_img VARCHAR(255),
    stand_id BINARY(16),
    valid TINYINT(1)
);

-- Table for order_cards
CREATE TABLE order_cards (
    card_id CHAR(15) PRIMARY KEY,
    debit DECIMAL(19, 2),
    active TINYINT(1)
);

-- Table for recharges
CREATE TABLE recharges (
    uuid BINARY(16) PRIMARY KEY,
    recharge_value DECIMAL(19, 2),
    recharge_time_stamp TIMESTAMP,
    payment_type ENUM('CREDIT', 'DEBIT', 'CASH') NOT NULL,
    customer_id BINARY(16),
    voluntary_id BINARY(16),
    valid TINYINT(1)
);

-- Table for sales
CREATE TABLE sales (
    uuid BINARY(16) PRIMARY KEY,
    on_order BOOLEAN,
    sale_time_stamp TIMESTAMP,
    customer_id BINARY(16),
    voluntary_id BINARY(16),
    valid TINYINT(1)
);

-- Table for stands
CREATE TABLE stands (
    uuid BINARY(16) PRIMARY KEY,
    stand VARCHAR(255),
    association_id BINARY(16),
    valid TINYINT(1)
);

-- Table for volunteers
CREATE TABLE volunteers (
    uuid BINARY(16) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    salt VARCHAR(255),
    fullname VARCHAR(255),
    stand_id BINARY(16),
    super_user TINYINT(1),
    valid TINYINT(1)
);
