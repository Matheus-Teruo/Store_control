-- V1__create-base-schema.sql

-- Table for associations
CREATE TABLE associations (
    uuid BINARY(16) PRIMARY KEY,
    association_name VARCHAR(255) UNIQUE NOT NULL,
    principal_name VARCHAR(255) NOT NULL,
    valid TINYINT NOT NULL
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
    voluntary_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for goods
CREATE TABLE goods (
    item_uuid BINARY(16),
    purchase_uuid BINARY(16),
    quantity INT NOT NULL,
    delivered INT,
    unit_price DECIMAL(19, 2) NOT NULL,
    valid TINYINT NOT NULL,
    PRIMARY KEY (item_uuid, purchase_uuid)
);

-- Table for items
CREATE TABLE items (
    uuid BINARY(16) PRIMARY KEY,
    item_name VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    stock INT NOT NULL,
    item_img VARCHAR(255),
    stand_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for order_cards
CREATE TABLE order_cards (
    card_id CHAR(15) PRIMARY KEY,
    debit DECIMAL(19, 2) NOT NULL,
    active TINYINT NOT NULL
);

-- Table for recharges
CREATE TABLE recharges (
    uuid BINARY(16) PRIMARY KEY,
    recharge_value DECIMAL(19, 2) NOT NULL,
    recharge_time_stamp TIMESTAMP NOT NULL,
    payment_type ENUM('CREDIT', 'DEBIT', 'CASH') NOT NULL,
    customer_uuid BINARY(16) NOT NULL,
    voluntary_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for purchases
CREATE TABLE purchases (
    uuid BINARY(16) PRIMARY KEY,
    on_order BOOLEAN,
    purchase_time_stamp TIMESTAMP NOT NULL,
    customer_uuid BINARY(16) NOT NULL,
    voluntary_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for stands
CREATE TABLE stands (
    uuid BINARY(16) PRIMARY KEY,
    stand_name VARCHAR(255) UNIQUE NOT NULL,
    association_uuid BINARY(16) NOT NULL,
    valid TINYINT NOT NULL
);

-- Table for volunteers
CREATE TABLE volunteers (
    uuid BINARY(16) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) UNIQUE NOT NULL,
    stand_uuid BINARY(16),
    superuser TINYINT NOT NULL,
    valid TINYINT NOT NULL
);
