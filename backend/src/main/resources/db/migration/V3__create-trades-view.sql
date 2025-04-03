-- V3__create-trades-view.sql

-- View for trades join recharges and purchases
CREATE VIEW trades_view AS
SELECT
    t.uuid,
    t.recharge_uuid,
    t.purchase_uuid,
    r.recharge_value,
    r.payment_type,
    p.on_order,
    p.stand_uuid,
    t.trade_time_stamp,
    t.valid
FROM trades t
JOIN recharges r ON t.recharge_uuid = r.uuid
JOIN purchases p ON t.purchase_uuid = p.uuid;