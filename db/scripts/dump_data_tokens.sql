-- Variáveis de UUID
SET @ASSOCIATION1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @ASSOCIATION2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @STAND1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @STAND2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @STAND3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @REGISTER1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @REGISTER2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT4_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT5_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT6_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @ORDER_CARD1_ID = 'ordercard000001';
SET @ORDER_CARD2_ID = 'ordercard000002';
SET @ORDER_CARD3_ID = 'ordercard000003';
SET @ORDER_CARD4_ID = 'ordercard000004';
SET @VOLUNTARY_MANAGER1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @VOLUNTARY_MANAGER2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @VOLUNTARY_USER1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @VOLUNTARY_USER2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @CUSTOMER1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @CUSTOMER2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @CUSTOMER3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @CUSTOMER4_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @RECHARGE1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @RECHARGE2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @RECHARGE3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @RECHARGE4_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE4_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE5_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE6_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRANSACTION1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRANSACTION2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @DONATION1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @DONATION2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @DONATION3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @REFUND_UUID = UNHEX(REPLACE(UUID(), '-', ''));

-- Inserir Associações
INSERT INTO associations (uuid, association_name, principal_name, association_key, valid) VALUES
(@ASSOCIATION1_UUID, 'Kitsune', 'Kitsune', 'key1', 1),
(@ASSOCIATION2_UUID, 'Tonakai', 'Tony Tony Chopper', 'key2', 1);

-- Inserir Funções
INSERT INTO functions (uuid, function_name, valid) VALUES
(@STAND1_UUID, 'Kitsune Cake', 1),
(@STAND2_UUID, 'Tonakai Candy', 1),
(@STAND3_UUID, 'Tonakai Meal', 1),
(@REGISTER1_UUID, 'Caixa 1', 1),
(@REGISTER2_UUID, 'Caixa 2', 1);

-- Inserir Estandes
INSERT INTO stands (uuid, association_uuid) VALUES
(@STAND1_UUID, @ASSOCIATION1_UUID),
(@STAND2_UUID, @ASSOCIATION2_UUID),
(@STAND3_UUID, @ASSOCIATION2_UUID);

-- Inserir Caixas
INSERT INTO registers (uuid, stand_uuid, total_cash, total_credit, total_debit, total_pix) VALUES
(@REGISTER1_UUID, null, 480.00, 75.00, 0.00, 100.00),
(@REGISTER2_UUID, null, 550.00, 0.00, 51.00, 0.00);

-- Inserir Produtos
INSERT INTO products (uuid, product_name, product_code, summary, description, combo, price, discount, stock, stand_uuid, valid) VALUES
(@PRODUCT1_UUID, 'Ichigo Soda', 1, "Bebida gaseificada", "", 0,  10.00, 0.00, 98, @STAND1_UUID, 1),
(@PRODUCT2_UUID, 'Angel Cake', 2, "Bolo japones", "Massa suave e leve, feito com a textura das claras em neves", 0, 12.00, 0.00, 46, @STAND1_UUID, 1),
(@PRODUCT3_UUID, 'Matcha Latte', 1, "Bebida lactea com matcha", "bebida com base na cultura japonesa de matcha", 0, 15.00, 0.00, 147, @STAND2_UUID, 1),
(@PRODUCT4_UUID, 'Matcha Cookies', 2, "Cookies com massa de matcha e gotas de chocolate branco", "", 0, 8.00, 0.00, 192, @STAND2_UUID, 1),
(@PRODUCT5_UUID, 'Brownie de Matcha', 3, "Bolo denso com gosto de matcha e com nozes na massa", "", 0, 12.00, 0.00, 247, @STAND2_UUID, 1),
(@PRODUCT6_UUID, 'Mabudofu', 4, "Prato com tofu apimentado acompanhado de arroz japones", "", 0, 35.00, 0.00, 299, @STAND3_UUID, 1);

-- Inserir Cartões de Ordem
INSERT INTO order_cards (card_id, debit, active) VALUES
(@ORDER_CARD1_ID, 0.00, 0),
(@ORDER_CARD2_ID, 0.00, 0),
(@ORDER_CARD3_ID, 0.00, 0),
(@ORDER_CARD4_ID, 0.00, 0);

-- Inserir Voluntários
INSERT INTO volunteers (uuid, username, password, fullname, related_association_uuid, function_uuid, voluntary_role, valid) VALUES
(@VOLUNTARY_MANAGER1_UUID, 'manager1', 'password_hash', 'Manager 1 Name', @ASSOCIATION1_UUID, @STAND1_UUID, 'ROLE_MANAGEMENT', 1),
(@VOLUNTARY_MANAGER2_UUID, 'manager2', 'password_hash', 'Manager 2 Name', @ASSOCIATION1_UUID, @REGISTER2_UUID, 'ROLE_MANAGEMENT', 1),
(@VOLUNTARY_USER1_UUID, 'voluntary1', 'password_hash', 'Voluntary 1 Name', @ASSOCIATION2_UUID, @STAND2_UUID, 'ROLE_VOLUNTARY', 1),
(@VOLUNTARY_USER2_UUID, 'voluntary2', 'password_hash', 'Voluntary 2 Name', @ASSOCIATION1_UUID, @REGISTER1_UUID, 'ROLE_VOLUNTARY', 1);

-- Inserir Clientes
INSERT INTO customers (uuid, card_id, customer_start, customer_end, in_use, valid) VALUES
(@CUSTOMER1_UUID, @ORDER_CARD1_ID, '2025-06-07 16:40:52', '2025-06-07 17:54:22', 0, 1),
(@CUSTOMER2_UUID, @ORDER_CARD2_ID, '2025-06-07 12:10:30', '2025-06-07 14:50:23', 0, 1),
(@CUSTOMER3_UUID, @ORDER_CARD2_ID, '2025-06-07 11:32:25', '2025-06-07 12:00:15', 0, 1),
(@CUSTOMER4_UUID, @ORDER_CARD3_ID, '2025-06-07 11:17:12', '2025-06-07 12:01:37', 0, 1);

-- Inserir Recharges
INSERT INTO recharges (uuid, recharge_value, payment_type, recharge_timestamp, customer_uuid, register_uuid, voluntary_uuid, valid) VALUES
(@RECHARGE1_UUID, 75.00, 'CREDIT', '2025-06-07 16:40:52', @CUSTOMER1_UUID, @REGISTER1_UUID, @VOLUNTARY_USER2_UUID, 1),
(@RECHARGE2_UUID, 50.00, 'CASH', '2025-06-07 12:10:30', @CUSTOMER2_UUID, @REGISTER2_UUID, @VOLUNTARY_MANAGER2_UUID, 1),
(@RECHARGE3_UUID, 100.00, 'PIX', '2025-06-07 11:32:25', @CUSTOMER3_UUID, @REGISTER1_UUID, @VOLUNTARY_USER2_UUID, 1),
(@RECHARGE4_UUID, 51.00, 'DEBIT', '2025-06-07 11:17:12', @CUSTOMER4_UUID, @REGISTER2_UUID, @VOLUNTARY_MANAGER2_UUID, 1);

-- Inserir Purchases
INSERT INTO purchases (uuid, on_order, purchase_timestamp, stand_uuid, customer_uuid, voluntary_uuid, reversal, valid) VALUES
(@PURCHASE1_UUID, 0, '2025-06-07 16:48:12', @STAND2_UUID, @CUSTOMER1_UUID, @VOLUNTARY_USER1_UUID, 0, 1),
(@PURCHASE2_UUID, 0, '2025-06-07 12:15:53', @STAND1_UUID, @CUSTOMER2_UUID, @VOLUNTARY_MANAGER1_UUID, 0, 1),
(@PURCHASE3_UUID, 0, '2025-06-07 11:39:41', @STAND2_UUID, @CUSTOMER3_UUID, @VOLUNTARY_USER1_UUID, 0, 1),
(@PURCHASE4_UUID, 0, '2025-06-07 11:43:39', @STAND1_UUID, @CUSTOMER3_UUID, @VOLUNTARY_MANAGER1_UUID, 0, 1),
(@PURCHASE5_UUID, 0, '2025-06-07 11:37:29', @STAND2_UUID, @CUSTOMER4_UUID, @VOLUNTARY_USER1_UUID, 0, 1),
(@PURCHASE6_UUID, 0, '2025-06-07 11:32:18', @STAND3_UUID, @CUSTOMER4_UUID, @VOLUNTARY_USER1_UUID, 0, 1);


INSERT INTO items (purchase_uuid, product_uuid, quantity, delivered, unit_price, discount, valid) VALUES
(@PURCHASE1_UUID, @PRODUCT3_UUID, 2, NULL, 15.00, 0.00, 1),  -- 30.00
(@PURCHASE1_UUID, @PRODUCT4_UUID, 4, NULL, 8.00, 0.00, 1),  -- 32.00
(@PURCHASE1_UUID, @PRODUCT5_UUID, 1, NULL, 12.00, 0.00, 1), -- 12.00 => 74.00 => 74.00
(@PURCHASE2_UUID, @PRODUCT2_UUID, 2, NULL, 12.00, 0.00, 1),  -- 24.00 => 24.00 => 24.00
(@PURCHASE3_UUID, @PRODUCT3_UUID, 1, NULL, 15.00, 0.00, 1),  -- 15.00
(@PURCHASE3_UUID, @PRODUCT4_UUID, 2, NULL, 8.00, 0.00, 1),  -- 16.00
(@PURCHASE3_UUID, @PRODUCT5_UUID, 2, NULL, 12.00, 0.00, 1),  -- 24.00 => 55.00
(@PURCHASE4_UUID, @PRODUCT1_UUID, 2, NULL, 10.00, 0.00, 1),  -- 20.00
(@PURCHASE4_UUID, @PRODUCT2_UUID, 2, NULL, 12.00, 0.00, 1),  -- 24.00 => 44.00 => 99.00
(@PURCHASE5_UUID, @PRODUCT4_UUID, 2, NULL, 8.00, 0.00, 1),  -- 16.00 => 16.00
(@PURCHASE6_UUID, @PRODUCT6_UUID, 1, NULL, 35.00, 0.00, 1);  -- 35.00 => 35.00 => 51.00


-- Inserir Transaction
INSERT INTO transactions (uuid, amount, transaction_type, transaction_timestamp, register_uuid, voluntary_uuid, valid) VALUES
(@TRANSACTION1_UUID, 500.00, 'ENTRY', '2025-06-07 10:04:57', @REGISTER1_UUID, @VOLUNTARY_MANAGER2_UUID, 1),
(@TRANSACTION2_UUID, 500.00, 'ENTRY', '2025-06-07 10:02:49', @REGISTER2_UUID, @VOLUNTARY_MANAGER2_UUID, 1);

-- Inserir Donation
INSERT INTO donations (uuid, donation_value, donation_timestamp, customer_uuid, register_uuid, voluntary_uuid, valid) VALUES
(@DONATION1_UUID, 1.00, '2025-06-07 17:54:22', @CUSTOMER1_UUID, @REGISTER1_UUID, @VOLUNTARY_USER2_UUID, 1),
(@DONATION2_UUID, 6.00, '2025-06-07 14:50:23', @CUSTOMER2_UUID, @REGISTER1_UUID, @VOLUNTARY_USER2_UUID, 1),
(@DONATION3_UUID, 1.00, '2025-06-07 12:00:15', @CUSTOMER3_UUID, @REGISTER1_UUID, @VOLUNTARY_USER2_UUID, 1);

-- Inserir Refund
INSERT INTO refunds (uuid, refund_value, refund_timestamp, customer_uuid, register_uuid, voluntary_uuid, valid) VALUES
(@REFUND_UUID, 20.00, '2025-06-07 14:50:23', @CUSTOMER2_UUID, @REGISTER1_UUID, @VOLUNTARY_USER2_UUID, 1);
