-- V2__add-foreign-keys.sql

-- Foreign key for associations table
ALTER TABLE associations
ADD CONSTRAINT fk_associations_principal_id
FOREIGN KEY (principal_id) REFERENCES volunteers (uuid);

-- Foreign keys for customers table
ALTER TABLE customers
ADD CONSTRAINT fk_customers_card_id
FOREIGN KEY (card_id) REFERENCES order_cards (card_id),
ADD CONSTRAINT fk_customers_voluntary_id
FOREIGN KEY (voluntary_id) REFERENCES volunteers (uuid);

-- Foreign keys for donations table
ALTER TABLE donations
ADD CONSTRAINT fk_donations_customer_id
FOREIGN KEY (customer_id) REFERENCES customers (uuid),
ADD CONSTRAINT fk_donations_voluntary_id
FOREIGN KEY (voluntary_id) REFERENCES volunteers (uuid);

-- Foreign keys for goods table
ALTER TABLE goods
ADD CONSTRAINT fk_goods_item_id
FOREIGN KEY (item_id) REFERENCES items (uuid),
ADD CONSTRAINT fk_goods_sale_id
FOREIGN KEY (sale_id) REFERENCES sales (uuid);

-- Foreign key for items table
ALTER TABLE items
ADD CONSTRAINT fk_items_stand_id
FOREIGN KEY (stand_id) REFERENCES stands (uuid);

-- Foreign keys for recharges table
ALTER TABLE recharges
ADD CONSTRAINT fk_recharges_customer_id
FOREIGN KEY (customer_id) REFERENCES customers (uuid),
ADD CONSTRAINT fk_recharges_voluntary_id
FOREIGN KEY (voluntary_id) REFERENCES volunteers (uuid);

-- Foreign keys for sales table
ALTER TABLE sales
ADD CONSTRAINT fk_sales_customer_id
FOREIGN KEY (customer_id) REFERENCES customers (uuid),
ADD CONSTRAINT fk_sales_voluntary_id
FOREIGN KEY (voluntary_id) REFERENCES volunteers (uuid);

-- Foreign key for stands table
ALTER TABLE stands
ADD CONSTRAINT fk_stands_association_id
FOREIGN KEY (association_id) REFERENCES associations (uuid);

-- Foreign key for volunteers table
ALTER TABLE volunteers
ADD CONSTRAINT fk_volunteers_stand_id
FOREIGN KEY (stand_id) REFERENCES stands (uuid);
