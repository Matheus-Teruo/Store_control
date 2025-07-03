-- Variáveis de UUID
SET @ASSOCIATION1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @ASSOCIATION2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @STAND1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @STAND2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @STAND3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @REGISTER1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @REGISTER2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @REGISTER3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT4_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT5_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PRODUCT6_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TAG1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TAG2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TAG3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @CARD1_ID = 'OrderCard000001';
SET @CARD2_ID = 'OrderCard000002';
SET @CARD3_ID = 'OrderCard000003';
SET @CARD4_ID = 'OrderCard000004';
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
SET @RECHARGE5_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @RECHARGE6_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE4_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE5_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @PURCHASE6_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRADES1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRADES2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRADES3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRADES4_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRADES5_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRADES6_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRANSACTION1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRANSACTION2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRANSACTION3_UUID = UNHEX(REPLACE(UUID(), '-', ''));

-- Inserir Associações
INSERT INTO associations (uuid, association_name, principal_name, association_key, valid) VALUES
(@ASSOCIATION1_UUID, 'Kitsune', 'Kitsune', 'key1', 1),
(@ASSOCIATION2_UUID, 'Tonakai', 'Tony Tony Chopper', 'key2', 1);

-- Inserir Funções
INSERT INTO functions (uuid, function_name, valid) VALUES
(@STAND1_UUID, 'Kitsune Cake', 1),
(@STAND2_UUID, 'Tonakai Candy', 1),
(@STAND3_UUID, 'Tonakai Meal', 1),
(@REGISTER1_UUID, 'Kitsune Cake Register', 1),
(@REGISTER2_UUID, 'Tonakai Candy Register', 1),
(@REGISTER3_UUID, 'Tonakai Meal Register', 1);

-- Inserir Estandes
INSERT INTO stands (uuid, association_uuid) VALUES
(@STAND1_UUID, @ASSOCIATION1_UUID),
(@STAND2_UUID, @ASSOCIATION2_UUID),
(@STAND3_UUID, @ASSOCIATION2_UUID);

-- Inserir Caixas
INSERT INTO registers (uuid, stand_uuid, total_cash, total_credit, total_debit, total_pix) VALUES
(@REGISTER1_UUID, @STAND1_UUID, 524.00, 0.00, 44.00, 0.00),
(@REGISTER2_UUID, @STAND2_UUID, 500.00, 74.00, 0.00, 71.00),
(@REGISTER3_UUID, @STAND3_UUID, 500.00, 0.00, 51.00, 0.00);

-- Inserir Produtos
INSERT INTO products (uuid, product_name, product_code, summary, description, combo, price, discount, stock, stand_uuid, valid) VALUES
(@PRODUCT1_UUID, 'Ichigo Soda', 1, "Bebida gaseificada", "", 0,  10.00, 0.00, 98, @STAND1_UUID, 1),
(@PRODUCT2_UUID, 'Angel Cake', 2, "Bolo japones", "Massa suave e leve, feito com a textura das claras em neves", 0, 12.00, 0.00, 46, @STAND1_UUID, 1),
(@PRODUCT3_UUID, 'Matcha Latte', 1, "Bebida lactea com matcha", "bebida com base na cultura japonesa de matcha", 0, 15.00, 0.00, 147, @STAND2_UUID, 1),
(@PRODUCT4_UUID, 'Matcha Cookies', 2, "Cookies com massa de matcha e gotas de chocolate branco", "", 0, 8.00, 0.00, 192, @STAND2_UUID, 1),
(@PRODUCT5_UUID, 'Brownie de Matcha', 3, "Bolo denso com gosto de matcha e com nozes na massa", "", 0, 12.00, 0.00, 247, @STAND2_UUID, 1),
(@PRODUCT6_UUID, 'Mabudofu', 4, "Prato com tofu apimentado acompanhado de arroz japones", "", 0, 35.00, 0.00, 299, @STAND3_UUID, 1);

-- Inserir Tags
INSERT INTO tags (uuid, tag_name, color) VALUES
(@TAG1_UUID, 'Refeição', "#ffb380"),
(@TAG2_UUID, 'Doce', "#f2b1f0"),
(@TAG3_UUID, 'Bebida', "#a8d9ff");

-- Inserir relação Tag Products
INSERT INTO tags (tag_uuid, product_uuid) VALUES
(@TAG1_UUID, @PRODUCT6_UUID),
(@TAG2_UUID, @PRODUCT2_UUID),
(@TAG2_UUID, @PRODUCT4_UUID),
(@TAG2_UUID, @PRODUCT5_UUID),
(@TAG3_UUID, @PRODUCT1_UUID),
(@TAG3_UUID, @PRODUCT3_UUID);

-- Inserir Cartões de Ordem
INSERT INTO cards (card_id, debit, active) VALUES
(@CARD1_ID, 0.00, 0),
(@CARD2_ID, 0.00, 0),
(@CARD3_ID, 0.00, 0),
(@CARD4_ID, 0.00, 0);

-- Inserir Voluntários
INSERT INTO volunteers (uuid, username, password, fullname, related_association_uuid, function_uuid, voluntary_role, valid) VALUES
(@VOLUNTARY_MANAGER1_UUID, 'manager1', 'password_hash', 'Manager 1 Name', @ASSOCIATION1_UUID, @STAND1_UUID, 'ROLE_MANAGEMENT', 1),
(@VOLUNTARY_MANAGER2_UUID, 'manager2', 'password_hash', 'Manager 2 Name', @ASSOCIATION1_UUID, @STAND2_UUID, 'ROLE_MANAGEMENT', 1),
(@VOLUNTARY_USER1_UUID, 'voluntary1', 'password_hash', 'Voluntary 1 Name', @ASSOCIATION2_UUID, @STAND2_UUID, 'ROLE_VOLUNTARY', 1),
(@VOLUNTARY_USER2_UUID, 'voluntary2', 'password_hash', 'Voluntary 2 Name', @ASSOCIATION1_UUID, @STAND3_UUID, 'ROLE_VOLUNTARY', 1);

-- Inserir Clientes
INSERT INTO customers (uuid, card_id, customer_start, customer_end, in_use, valid) VALUES
(@CUSTOMER1_UUID, @CARD1_ID, '2025-06-07 12:11:52', '2025-06-07 12:20:32', 0, 1),
(@CUSTOMER2_UUID, @CARD2_ID, '2025-06-07 12:10:30', '2025-06-07 12:15:40', 0, 1),
(@CUSTOMER3_UUID, @CARD2_ID, '2025-06-07 11:32:25', '2025-06-07 13:35:52', 0, 1),
(@CUSTOMER4_UUID, @CARD3_ID, '2025-06-07 11:17:12', '2025-06-07 13:19:36', 0, 1);

-- Inserir Recharges
INSERT INTO recharges (uuid, recharge_value, payment_type, recharge_timestamp, customer_uuid, register_uuid, voluntary_uuid, valid) VALUES
(@RECHARGE1_UUID, 74.00, 'CREDIT', '2025-06-07 12:11:52', @CUSTOMER1_UUID, @REGISTER2_UUID, @VOLUNTARY_USER2_UUID, 1),
(@RECHARGE2_UUID, 24.00, 'CASH', '2025-06-07 12:10:30', @CUSTOMER2_UUID, @REGISTER1_UUID, @VOLUNTARY_MANAGER2_UUID, 1),
(@RECHARGE3_UUID, 55.00, 'PIX', '2025-06-07 11:32:25', @CUSTOMER3_UUID, @REGISTER2_UUID, @VOLUNTARY_USER2_UUID, 1),
(@RECHARGE4_UUID, 44.00, 'DEBIT', '2025-06-07 13:31:12', @CUSTOMER3_UUID, @REGISTER1_UUID, @VOLUNTARY_MANAGER2_UUID, 1),
(@RECHARGE5_UUID, 16.00, 'PIX', '2025-06-07 11:17:13', @CUSTOMER4_UUID, @REGISTER2_UUID, @VOLUNTARY_USER2_UUID, 1),
(@RECHARGE6_UUID, 51.00, 'DEBIT', '2025-06-07 13:16:15', @CUSTOMER4_UUID, @REGISTER3_UUID, @VOLUNTARY_MANAGER2_UUID, 1);

-- Inserir Purchases
INSERT INTO purchases (uuid, on_order, purchase_timestamp, stand_uuid, customer_uuid, voluntary_uuid, reversal, valid) VALUES
(@PURCHASE1_UUID, 0, '2025-06-07 12:20:32', @STAND2_UUID, @CUSTOMER1_UUID, @VOLUNTARY_USER1_UUID, 0, 1),
(@PURCHASE2_UUID, 0, '2025-06-07 12:15:40', @STAND1_UUID, @CUSTOMER2_UUID, @VOLUNTARY_MANAGER1_UUID, 0, 1),
(@PURCHASE3_UUID, 0, '2025-06-07 11:36:12', @STAND2_UUID, @CUSTOMER3_UUID, @VOLUNTARY_USER1_UUID, 0, 1),
(@PURCHASE4_UUID, 0, '2025-06-07 13:35:52', @STAND1_UUID, @CUSTOMER3_UUID, @VOLUNTARY_MANAGER1_UUID, 0, 1),
(@PURCHASE5_UUID, 0, '2025-06-07 11:18:56', @STAND2_UUID, @CUSTOMER4_UUID, @VOLUNTARY_USER1_UUID, 0, 1),
(@PURCHASE6_UUID, 0, '2025-06-07 13:19:36', @STAND3_UUID, @CUSTOMER4_UUID, @VOLUNTARY_USER1_UUID, 0, 1);


INSERT INTO items (purchase_uuid, product_uuid, quantity, delivered, unit_price, discount, valid) VALUES
(@PURCHASE1_UUID, @PRODUCT3_UUID, 2, 2, 15.00, 0.00, 1),  -- 30.00
(@PURCHASE1_UUID, @PRODUCT4_UUID, 4, 4, 8.00, 0.00, 1),  -- 32.00
(@PURCHASE1_UUID, @PRODUCT5_UUID, 1, 1, 12.00, 0.00, 1), -- 12.00 => 74.00 => 74.00
(@PURCHASE2_UUID, @PRODUCT2_UUID, 2, 2, 12.00, 0.00, 1),  -- 24.00 => 24.00 => 24.00
(@PURCHASE3_UUID, @PRODUCT3_UUID, 1, 1, 15.00, 0.00, 1),  -- 15.00
(@PURCHASE3_UUID, @PRODUCT4_UUID, 2, 2, 8.00, 0.00, 1),  -- 16.00
(@PURCHASE3_UUID, @PRODUCT5_UUID, 2, 2, 12.00, 0.00, 1),  -- 24.00 => 55.00
(@PURCHASE4_UUID, @PRODUCT1_UUID, 2, 2, 10.00, 0.00, 1),  -- 20.00
(@PURCHASE4_UUID, @PRODUCT2_UUID, 2, 2, 12.00, 0.00, 1),  -- 24.00 => 44.00 => 99.00
(@PURCHASE5_UUID, @PRODUCT4_UUID, 2, 2, 8.00, 0.00, 1),  -- 16.00 => 16.00
(@PURCHASE6_UUID, @PRODUCT6_UUID, 1, 1, 35.00, 0.00, 1);  -- 35.00 => 35.00 => 51.00

-- Inserir Trades
INSERT INTO trades (uuid, recharge_uuid, purchase_uuid, trade_timestamp, valid) VALUES
(@TRADES1_UUID, @RECHARGE1_UUID, @PURCHASE1_UUID, '2025-06-07 12:11:52', 1),
(@TRADES2_UUID, @RECHARGE2_UUID, @PURCHASE2_UUID, '2025-06-07 12:10:30', 1),
(@TRADES3_UUID, @RECHARGE3_UUID, @PURCHASE3_UUID, '2025-06-07 11:32:25', 1),
(@TRADES4_UUID, @RECHARGE4_UUID, @PURCHASE4_UUID, '2025-06-07 13:31:12', 1),
(@TRADES5_UUID, @RECHARGE5_UUID, @PURCHASE5_UUID, '2025-06-07 11:17:13', 1),
(@TRADES6_UUID, @RECHARGE6_UUID, @PURCHASE6_UUID, '2025-06-07 13:16:15', 1);

-- Inserir Transaction
INSERT INTO transactions (uuid, amount, transaction_type, transaction_timestamp, register_uuid, voluntary_uuid, valid) VALUES
(@TRANSACTION1_UUID, 500.00, 'ENTRY', '2025-06-07 10:04:57', @REGISTER1_UUID, @VOLUNTARY_MANAGER2_UUID, 1),
(@TRANSACTION2_UUID, 500.00, 'ENTRY', '2025-06-07 10:02:49', @REGISTER2_UUID, @VOLUNTARY_MANAGER2_UUID, 1),
(@TRANSACTION3_UUID, 500.00, 'ENTRY', '2025-06-07 10:01:26', @REGISTER3_UUID, @VOLUNTARY_MANAGER2_UUID, 1);
