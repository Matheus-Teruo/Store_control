-- V5__add-pix-support-to-recharges-and-cash-registers.sql

-- Update cash_registers table
ALTER TABLE cash_registers
ADD COLUMN pix_total DECIMAL(19, 2) NOT NULL DEFAULT 0;

-- Update recharges table
ALTER TABLE recharges
MODIFY COLUMN payment_type ENUM('CREDIT', 'DEBIT', 'CASH', 'PIX') NOT NULL;