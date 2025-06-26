package com.storecontrol.backend.models.registers.response;

import com.storecontrol.backend.models.registers.Register;
import com.storecontrol.backend.models.stands.response.ResponseSummaryStand;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseRegister(
    UUID uuid,
    String registerName,
    ResponseSummaryStand summaryStand,
    BigDecimal totalCash,
    BigDecimal totalCredit,
    BigDecimal totalDebit,
    BigDecimal totalPix
) {

  public ResponseRegister(Register register) {
    this(register.getUuid(),
        register.getFunctionName(),
        register.getRelatedStand() != null ? new ResponseSummaryStand(register.getRelatedStand()) : null,
        register.getTotalCash(),
        register.getTotalCredit(),
        register.getTotalDebit(),
        register.getTotalPix()
    );
  }
}
