-- V5__create-trades-table.sql

-- Table for trades
CREATE TABLE trades (
    uuid BINARY(16) PRIMARY KEY,
    recharge_uuid BINARY(16) NOT NULL,
    purchase_uuid BINARY(16) NOT NULL,
    trade_time_stamp TIMESTAMP NOT NULL,
    valid TINYINT NOT NULL,
    FOREIGN KEY (recharge_uuid) REFERENCES recharges(uuid) ON DELETE CASCADE,
    FOREIGN KEY (purchase_uuid) REFERENCES purchases(uuid) ON DELETE CASCADE
);

-- View for trades join recharges and purchases
CREATE VIEW trades_view AS
SELECT
    t.uuid,
    t.recharge_uuid,
    t.purchase_uuid,
    r.recharge_value,
    r.payment_type_enum,
    p.on_order,
    t.trade_time_stamp,
    t.valid
FROM trades t
JOIN recharges r ON t.recharge_uuid = r.uuid
JOIN purchases p ON t.purchase_uuid = p.uuid;