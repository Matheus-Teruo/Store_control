-- V4__insert-default-values.sql

DELIMITER $$

CREATE PROCEDURE insert_defaults()
BEGIN
    DECLARE mode_value VARCHAR(20);
    SET mode_value = '${MODE}';

    IF mode_value = 'simple' THEN
        INSERT INTO cards (card_id, debit, active)
        VALUES ('${CARD_ID}', 0.00, 0);
    END IF;
END $$

DELIMITER ;

CALL insert_defaults();