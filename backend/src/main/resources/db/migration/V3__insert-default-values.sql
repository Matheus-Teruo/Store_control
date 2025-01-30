DELIMITER $$

CREATE PROCEDURE insert_defaults()
BEGIN
    DECLARE mode_value VARCHAR(20);
    SET mode_value = '${MODE}';

    IF mode_value = 'simple' THEN
        INSERT INTO functions (uuid, function_name, valid)
        VALUES (UNHEX(REPLACE('${FUNC_UUID}', '-', '')), 'Default Function', 1);

        INSERT INTO order_cards (card_id, debit, active)
        VALUES ('${CARD_ID}', 0.00, 0);

        INSERT INTO cash_registers (uuid, cash_total, credit_total, debit_total)
        VALUES (UNHEX(REPLACE('${FUNC_UUID}', '-', '')), 0.00, 0.00, 0.00);
    END IF;
END $$

DELIMITER ;

CALL insert_defaults();