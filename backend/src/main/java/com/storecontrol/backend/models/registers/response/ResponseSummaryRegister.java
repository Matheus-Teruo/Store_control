package com.storecontrol.backend.models.registers.response;

import com.storecontrol.backend.models.registers.Register;

import java.util.UUID;

public record ResponseSummaryRegister(
    UUID uuid,
    String registerName
) {

  public ResponseSummaryRegister(Register register) {
    this(register.getUuid(),
        register.getFunctionName()
    );
  }
}
