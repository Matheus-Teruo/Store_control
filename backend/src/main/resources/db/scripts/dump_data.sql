-- Variáveis de UUID
SET @ASSOCIATION1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @ASSOCIATION2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @STAND1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @STAND2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @STAND3_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @CASH_REGISTER1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @CASH_REGISTER2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
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
SET @TRANSACTION1_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @TRANSACTION2_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @DONATION_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @REFUND_UUID = UNHEX(REPLACE(UUID(), '-', ''));

-- Inserir Associações
INSERT INTO associations (uuid, association_name, principal_name, valid) VALUES
(@ASSOCIATION1_UUID, 'Associação 1', 'Principal 1', 1),
(@ASSOCIATION2_UUID, 'Associação 2', 'Principal 2', 1);

-- Inserir Funções
INSERT INTO functions (uuid, function_name, valid) VALUES
(@STAND1_UUID, 'Estande 1', 1),
(@STAND2_UUID, 'Estande 2', 1),
(@STAND3_UUID, 'Estande 3', 1),
(@CASH_REGISTER1_UUID, 'Caixa 1', 1),
(@CASH_REGISTER2_UUID, 'Caixa 2', 1);

-- Inserir Estandes
INSERT INTO stands (uuid, association_uuid) VALUES
(@STAND1_UUID, @ASSOCIATION1_UUID),
(@STAND2_UUID, @ASSOCIATION2_UUID),
(@STAND3_UUID, @ASSOCIATION2_UUID);

-- Inserir Caixas
INSERT INTO cash_registers (uuid, cash_total, credit_total, debit_total) VALUES
(@CASH_REGISTER1_UUID, 700.00, 100.00, 0.00),
(@CASH_REGISTER2_UUID, 590.00, 0.00, 120.00);

-- Inserir Produtos
INSERT INTO products (uuid, product_name, summary, description, price, discount, stock, stand_uuid, valid) VALUES
(@PRODUCT1_UUID, 'Produto 1 bebida', "bebida gaseificada", "",  10.00, 0.00, 99, @STAND1_UUID, 1),
(@PRODUCT2_UUID, 'Produto 2 aperitivo', "aperitivo de massa frita", "massa frita doce com gengibre", 8.00, 0.00, 41, @STAND1_UUID, 1),
(@PRODUCT3_UUID, 'Produto 3 bebida', "bebida lactea com matcha", "bebida com base na cultura japonesa de matcha", 15.00, 0.00, 147, @STAND2_UUID, 1),
(@PRODUCT4_UUID, 'Produto 4 comida vegetariana', "comida com arroz e legumes", "", 25.00, 0.00, 197, @STAND2_UUID, 1),
(@PRODUCT5_UUID, 'Produto 5 comida', "comida com arroz, carne e legumes", "", 30.00, 0.00, 248, @STAND2_UUID, 1),
(@PRODUCT6_UUID, 'Produto 6 doce', "doce com base em matcha", "", 8.00, 0.00, 300, @STAND3_UUID, 1);

-- Inserir Cartões de Ordem
INSERT INTO order_cards (card_id, debit, active) VALUES
(@ORDER_CARD1_ID, 20.00, 1),
(@ORDER_CARD2_ID, 112.00, 1),
(@ORDER_CARD3_ID, 120.00, 1),
(@ORDER_CARD4_ID, 0.00, 0);

-- Inserir Voluntários
INSERT INTO volunteers (uuid, username, password, fullname, function_uuid, voluntary_role, valid) VALUES
(@VOLUNTARY_MANAGER1_UUID, 'manager1', 'password_hash', 'Manager 1 Name', @STAND1_UUID, 'ROLE_ADMIN', 1),
(@VOLUNTARY_MANAGER2_UUID, 'manager2', 'password_hash', 'Manager 2 Name', @CASH_REGISTER2_UUID, 'ROLE_ADMIN', 1),
(@VOLUNTARY_USER1_UUID, 'user1', 'password_hash', 'User 1 Name', @STAND2_UUID, 'ROLE_USER', 1),
(@VOLUNTARY_USER2_UUID, 'user2', 'password_hash', 'User 2 Name', @CASH_REGISTER1_UUID, 'ROLE_USER', 1);

-- Inserir Clientes
INSERT INTO customers (uuid, order_card_id, customer_start, customer_end, in_use) VALUES
(@CUSTOMER1_UUID, @ORDER_CARD1_ID, NOW(), NULL, 1),
(@CUSTOMER2_UUID, @ORDER_CARD2_ID, NOW(), NOW(), 0),
(@CUSTOMER3_UUID, @ORDER_CARD2_ID, NOW(), NULL, 1),
(@CUSTOMER4_UUID, @ORDER_CARD3_ID, NOW(), NULL, 1);

-- Inserir Recharges
INSERT INTO recharges (uuid, recharge_value, payment_type, recharge_time_stamp, customer_uuid, cash_register_uuid, voluntary_uuid, valid) VALUES
(@RECHARGE1_UUID, 100.00, 'CREDIT', NOW(), @CUSTOMER1_UUID, @CASH_REGISTER1_UUID, @VOLUNTARY_USER2_UUID, 1),
(@RECHARGE2_UUID, 90.00, 'CASH', NOW(), @CUSTOMER2_UUID, @CASH_REGISTER2_UUID, @VOLUNTARY_MANAGER2_UUID, 1),
(@RECHARGE3_UUID, 200.00, 'CASH', NOW(), @CUSTOMER3_UUID, @CASH_REGISTER1_UUID, @VOLUNTARY_USER2_UUID, 1),
(@RECHARGE4_UUID, 120.00, 'DEBIT', NOW(), @CUSTOMER4_UUID, @CASH_REGISTER2_UUID, @VOLUNTARY_MANAGER2_UUID, 1);

-- Inserir Purchases
INSERT INTO purchases (uuid, on_order, purchase_time_stamp, customer_uuid, voluntary_uuid, valid) VALUES
(@PURCHASE1_UUID, FALSE, NOW(), @CUSTOMER1_UUID, @VOLUNTARY_USER1_UUID, 1),
(@PURCHASE2_UUID, FALSE, NOW(), @CUSTOMER2_UUID, @VOLUNTARY_MANAGER1_UUID, 1),
(@PURCHASE3_UUID, FALSE, NOW(), @CUSTOMER3_UUID, @VOLUNTARY_USER1_UUID, 1),
(@PURCHASE4_UUID, FALSE, NOW(), @CUSTOMER3_UUID, @VOLUNTARY_MANAGER1_UUID, 1);

INSERT INTO items (product_uuid, purchase_uuid, quantity, delivered, unit_price, discount, valid) VALUES
(@PRODUCT3_UUID, @PURCHASE1_UUID, 2, NULL, 15.00, 0.00, 1),
(@PRODUCT4_UUID, @PURCHASE1_UUID, 2, NULL, 25.00, 0.00, 1),
(@PRODUCT2_UUID, @PURCHASE2_UUID, 8, NULL, 8.00, 0.00, 1),
(@PRODUCT3_UUID, @PURCHASE3_UUID, 1, NULL, 15.00, 0.00, 1),
(@PRODUCT4_UUID, @PURCHASE3_UUID, 1, NULL, 25.00, 0.00, 1),
(@PRODUCT5_UUID, @PURCHASE3_UUID, 2, NULL, 30.00, 0.00, 1),
(@PRODUCT1_UUID, @PURCHASE4_UUID, 1, NULL, 10.00, 0.00, 1),
(@PRODUCT2_UUID, @PURCHASE4_UUID, 1, NULL, 8.00, 0.00, 1);

-- Inserir Transaction
INSERT INTO transactions (uuid, amount, transaction_type, transaction_time_stamp, cash_register_uuid, voluntary_uuid, valid) VALUES
(@TRANSACTION1_UUID, 500.00, 'ENTRY', NOW(), @CASH_REGISTER1_UUID, @VOLUNTARY_MANAGER2_UUID, 1),
(@TRANSACTION2_UUID, 500.00, 'ENTRY', NOW(), @CASH_REGISTER2_UUID, @VOLUNTARY_MANAGER2_UUID, 1);

-- Inserir Donation
INSERT INTO donations (uuid, donation_value, donation_time_stamp, customer_uuid, cash_register_uuid, voluntary_uuid, valid) VALUES
(@DONATION_UUID, 20.00, NOW(), @CUSTOMER2_UUID, @CASH_REGISTER1_UUID, @VOLUNTARY_USER2_UUID, 1);

-- Inserir Refund
INSERT INTO refunds (uuid, refund_value, refund_time_stamp, customer_uuid, cash_register_uuid, voluntary_uuid, valid) VALUES
(@REFUND_UUID, 6.00, NOW(), @CUSTOMER2_UUID, @CASH_REGISTER1_UUID, @VOLUNTARY_USER2_UUID, 1);
