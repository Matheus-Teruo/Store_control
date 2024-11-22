package com.storecontrol.backend.models.registers.request;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateCashRegister(
    @NotNull
    String uuid,
    String cashRegisterName
) {
}
