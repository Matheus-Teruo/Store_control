package com.storecontrol.backend.models.registers.response;

import com.storecontrol.backend.models.registers.Register;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseRegister(
    UUID uuid,
    String registerName,
    BigDecimal cashTotal,
    BigDecimal creditTotal,
    BigDecimal debitTotal,
    BigDecimal pixTotal
) {

  public ResponseRegister(Register register) {
    this(register.getUuid(),
        register.getFunctionName(),
        register.getCashTotal(),
        register.getCreditTotal(),
        register.getDebitTotal(),
        register.getPixTotal()
    );
  }
}
