package com.storecontrol.backend.models.registers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record RequestUpdateCashRegister(
    @NotNull(message = "{request.validation.updateCashRegister.uuid.notnull}")
    UUID uuid,

    @Pattern(regexp = "^[A-Za-z0-9 ]+$", message = "{request.validation.updateCashRegister.cashRegisterName.pattern}")
    String cashRegisterName
) {
}
