-- V2__add-foreign-keys.sql

-- Foreign keys for customers table
ALTER TABLE customers
ADD CONSTRAINT fk_customers_card_id
FOREIGN KEY (card_id) REFERENCES cards (card_id);

-- Foreign keys for donations table
ALTER TABLE donations
ADD CONSTRAINT fk_donations_customer_uuid
FOREIGN KEY (customer_uuid) REFERENCES customers (uuid),
ADD CONSTRAINT fk_donations_register_uuid
FOREIGN KEY (register_uuid) REFERENCES registers (uuid),
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

-- Foreign key for products table
ALTER TABLE product_combos
ADD CONSTRAINT fk_product_combo_uuid
FOREIGN KEY (product_combo_uuid) REFERENCES products (uuid) ON DELETE CASCADE,
ADD CONSTRAINT fk_product_included_uuid
FOREIGN KEY (product_included_uuid) REFERENCES products (uuid) ON DELETE CASCADE;

-- Foreign keys for purchases table
ALTER TABLE purchases
ADD CONSTRAINT fk_purchases_stand_uuid
FOREIGN KEY (stand_uuid) REFERENCES stands (uuid),
ADD CONSTRAINT fk_purchases_customer_uuid
FOREIGN KEY (customer_uuid) REFERENCES customers (uuid),
ADD CONSTRAINT fk_purchases_voluntary_uuid
FOREIGN KEY (voluntary_uuid) REFERENCES volunteers (uuid);

-- Foreign keys for recharges table
ALTER TABLE recharges
ADD CONSTRAINT fk_recharges_customer_uuid
FOREIGN KEY (customer_uuid) REFERENCES customers (uuid),
ADD CONSTRAINT fk_recharges_register_uuid
FOREIGN KEY (register_uuid) REFERENCES registers (uuid),
ADD CONSTRAINT fk_recharges_voluntary_uuid
FOREIGN KEY (voluntary_uuid) REFERENCES volunteers (uuid);

-- Foreign keys for refunds table
ALTER TABLE refunds
ADD CONSTRAINT fk_refunds_customer_uuid
FOREIGN KEY (customer_uuid) REFERENCES customers (uuid),
ADD CONSTRAINT fk_refunds_register_uuid
FOREIGN KEY (register_uuid) REFERENCES registers (uuid),
ADD CONSTRAINT fk_refunds_voluntary_uuid
FOREIGN KEY (voluntary_uuid) REFERENCES volunteers (uuid);

-- Foreign keys for registers table
ALTER TABLE registers
ADD CONSTRAINT fk_registers_function_uuid
FOREIGN KEY (uuid) REFERENCES functions (uuid),
ADD CONSTRAINT fk_registers_stand_uuid
FOREIGN KEY (stand_uuid) REFERENCES stands (uuid);

-- Foreign key for stands table
ALTER TABLE stands
ADD CONSTRAINT fk_stands_function_uuid
FOREIGN KEY (uuid) REFERENCES functions (uuid),
ADD CONSTRAINT fk_stands_association_uuid
FOREIGN KEY (association_uuid) REFERENCES associations (uuid);

-- Foreign keys for tag_products table
ALTER TABLE tag_products
ADD CONSTRAINT fk_tag_products_tag_uuid
FOREIGN KEY (tag_uuid) REFERENCES tags (uuid) ON DELETE CASCADE,
ADD CONSTRAINT fk_tag_products_product_uuid
FOREIGN KEY (product_uuid) REFERENCES products (uuid) ON DELETE CASCADE;

-- Foreign keys for trades table
ALTER TABLE trades
ADD CONSTRAINT fk_trades_recharge_uuid
FOREIGN KEY (recharge_uuid) REFERENCES recharges (uuid),
ADD CONSTRAINT fk_trades_purchase_uuid
FOREIGN KEY (purchase_uuid) REFERENCES purchases (uuid);

-- Foreign keys for transactions table
ALTER TABLE transactions
ADD CONSTRAINT fk_transactions_register_uuid
FOREIGN KEY (register_uuid) REFERENCES registers (uuid);

-- Foreign key for volunteers table
ALTER TABLE volunteers
ADD CONSTRAINT fk_volunteers_function_uuid
FOREIGN KEY (function_uuid) REFERENCES functions (uuid),
ADD CONSTRAINT fk_volunteers_association_uuid
FOREIGN KEY (related_association_uuid) REFERENCES associations (uuid);
