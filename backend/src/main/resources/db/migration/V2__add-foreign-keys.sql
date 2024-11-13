-- V2__add-foreign-keys.sql

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

-- Foreign keys for goods table
ALTER TABLE goods
ADD CONSTRAINT fk_goods_item_uuid
FOREIGN KEY (item_uuid) REFERENCES items (uuid),
ADD CONSTRAINT fk_goods_sale_uuid
FOREIGN KEY (sale_uuid) REFERENCES sales (uuid);

-- Foreign key for items table
ALTER TABLE items
ADD CONSTRAINT fk_items_stand_uuid
FOREIGN KEY (stand_uuid) REFERENCES stands (uuid);

-- Foreign keys for recharges table
ALTER TABLE recharges
ADD CONSTRAINT fk_recharges_customer_uuid
FOREIGN KEY (customer_uuid) REFERENCES customers (uuid),
ADD CONSTRAINT fk_recharges_voluntary_uuid
FOREIGN KEY (voluntary_uuid) REFERENCES volunteers (uuid);

-- Foreign keys for sales table
ALTER TABLE sales
ADD CONSTRAINT fk_sales_customer_uuid
FOREIGN KEY (customer_uuid) REFERENCES customers (uuid),
ADD CONSTRAINT fk_sales_voluntary_uuid
FOREIGN KEY (voluntary_uuid) REFERENCES volunteers (uuid);

-- Foreign key for stands table
ALTER TABLE stands
ADD CONSTRAINT fk_stands_association_uuid
FOREIGN KEY (association_uuid) REFERENCES associations (uuid);

-- Foreign key for volunteers table
ALTER TABLE volunteers
ADD CONSTRAINT fk_volunteers_stand_uuid
FOREIGN KEY (stand_uuid) REFERENCES stands (uuid);
