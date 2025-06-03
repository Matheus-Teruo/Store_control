ALTER TABLE products
ADD COLUMN combo TINYINT NOT NULL DEFAULT FALSE;

ALTER TABLE products
MODIFY COLUMN stock INT NULL;

-- Table for product_combos
CREATE TABLE product_combos (
    combo_product_uuid BINARY(16) NOT NULL,
    included_product_uuid BINARY(16) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    PRIMARY KEY (combo_product_uuid, included_product_uuid),
    CONSTRAINT fk_combo_product
        FOREIGN KEY (combo_product_uuid) REFERENCES products(uuid)
        ON DELETE CASCADE,
    CONSTRAINT fk_included_product
        FOREIGN KEY (included_product_uuid) REFERENCES products(uuid)
        ON DELETE CASCADE
);