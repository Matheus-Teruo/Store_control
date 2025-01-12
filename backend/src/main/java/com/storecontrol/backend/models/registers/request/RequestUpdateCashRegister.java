package com.storecontrol.backend.models.registers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RequestUpdateCashRegister(
    @NotNull(message = "{request.validation.updateCashRegister.uuid.notnull}")
    UUID uuid,

    @Size(min = 3, message = "{request.validation.updateCashRegister.cashRegisterName.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ]{3,}$", message = "{request.validation.updateCashRegister.cashRegisterName.pattern}")
    String cashRegisterName
) {
}
