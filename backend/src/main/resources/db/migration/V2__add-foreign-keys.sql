-- V2__add-foreign-keys.sql

-- Foreign keys for cash_registers table
ALTER TABLE cash_registers
ADD CONSTRAINT fk_cash_registers_function_uuid
FOREIGN KEY (uuid) REFERENCES functions (uuid);

-- Foreign keys for customers table
ALTER TABLE customers
ADD CONSTRAINT fk_customers_order_card_id
FOREIGN KEY (order_card_id) REFERENCES order_cards (card_id);

-- Foreign keys for donations table
ALTER TABLE donations
ADD CONSTRAINT fk_donations_customer_uuid
FOREIGN KEY (customer_uuid) REFERENCES customers (uuid),
ADD CONSTRAINT fk_donations_voluntary_uuid
FOREIGN KEY (voluntary_uuid) REFERENCES volunteers (uuid);

-- Foreign keys for items table
ALTER TABLE items
ADD CONSTRAINT fk_items_product_uuid
FOREIGN KEY (product_uuid) REFERENCES products (uuid),
ADD CONSTRAINT fk_items_purchase_uuid
FOREIGN KEY (purchase_uuid) REFERENCES purchases (uuid);

-- Foreign key for products table
ALTER TABLE products
ADD CONSTRAINT fk_products_stand_uuid
FOREIGN KEY (stand_uuid) REFERENCES stands (uuid);

-- Foreign keys for purchases table
ALTER TABLE purchases
ADD CONSTRAINT fk_purchases_customer_uuid
FOREIGN KEY (customer_uuid) REFERENCES customers (uuid),
ADD CONSTRAINT fk_purchases_voluntary_uuid
FOREIGN KEY (voluntary_uuid) REFERENCES volunteers (uuid);

-- Foreign keys for recharges table
ALTER TABLE recharges
ADD CONSTRAINT fk_recharges_customer_uuid
FOREIGN KEY (customer_uuid) REFERENCES customers (uuid),
ADD CONSTRAINT fk_recharges_cash_register_uuid
FOREIGN KEY (cash_register_uuid) REFERENCES cash_registers (uuid),
ADD CONSTRAINT fk_recharges_voluntary_uuid
FOREIGN KEY (voluntary_uuid) REFERENCES volunteers (uuid);

-- Foreign keys for refunds table
ALTER TABLE refunds
ADD CONSTRAINT fk_refunds_customer_uuid
FOREIGN KEY (customer_uuid) REFERENCES customers (uuid),
ADD CONSTRAINT fk_refunds_cash_register_uuid
FOREIGN KEY (cash_register_uuid) REFERENCES cash_registers (uuid),
ADD CONSTRAINT fk_refunds_voluntary_uuid
FOREIGN KEY (voluntary_uuid) REFERENCES volunteers (uuid);

-- Foreign key for stands table
ALTER TABLE stands
ADD CONSTRAINT fk_stands_function_uuid
FOREIGN KEY (uuid) REFERENCES functions (uuid),
ADD CONSTRAINT fk_stands_association_uuid
FOREIGN KEY (association_uuid) REFERENCES associations (uuid);

-- Foreign keys for transactions table
ALTER TABLE transactions
ADD CONSTRAINT fk_transactions_cash_register_uuid
FOREIGN KEY (cash_register_uuid) REFERENCES cash_registers (uuid);

-- Foreign key for volunteers table
ALTER TABLE volunteers
ADD CONSTRAINT fk_volunteers_function_uuid
FOREIGN KEY (function_uuid) REFERENCES functions (uuid);
