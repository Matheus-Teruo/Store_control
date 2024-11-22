package com.storecontrol.backend.models.registers.response;

import com.storecontrol.backend.models.registers.CashRegister;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseCashRegister(
    UUID uuid,
    String cashRegister,
    BigDecimal cashTotal,
    BigDecimal creditTotal,
    BigDecimal debitTotal
) {

  public ResponseCashRegister(CashRegister cashRegister) {
    this(cashRegister.getUuid(),
        cashRegister.getFunctionName(),
        cashRegister.getCashTotal(),
        cashRegister.getCreditTotal(),
        cashRegister.getDebitTotal()
    );
  }
}
