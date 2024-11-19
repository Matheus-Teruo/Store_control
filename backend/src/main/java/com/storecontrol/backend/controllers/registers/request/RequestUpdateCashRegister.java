package com.storecontrol.backend.controllers.registers.request;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateCashRegister(
    @NotNull
    String uuid,
    String cashRegisterName
) {
}
