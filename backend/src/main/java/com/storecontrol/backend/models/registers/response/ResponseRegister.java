package com.storecontrol.backend.models.registers.response;

import com.storecontrol.backend.models.registers.Register;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseRegister(
    UUID uuid,
    String registerName,
    String standName,
    BigDecimal totalCash,
    BigDecimal totalCredit,
    BigDecimal totalDebit,
    BigDecimal totalPix
) {

  public ResponseRegister(Register register) {
    this(register.getUuid(),
        register.getFunctionName(),
        register.getRelatedStand() != null ? register.getRelatedStand().getFunctionName() : null,
        register.getTotalCash(),
        register.getTotalCredit(),
        register.getTotalDebit(),
        register.getTotalPix()
    );
  }
}
