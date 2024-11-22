package com.storecontrol.backend.models.registers.response;

import com.storecontrol.backend.models.registers.CashRegister;

import java.util.UUID;

public record ResponseSummaryCashRegister(
    UUID uuid,
    String cashRegister
) {

  public ResponseSummaryCashRegister(CashRegister cashRegister) {
    this(cashRegister.getUuid(),
        cashRegister.getFunctionName()
    );
  }
}
