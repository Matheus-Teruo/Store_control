package com.storecontrol.backend.models.registers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RequestCreateCashRegister(
    @NotBlank(message = "{request.validation.createCashRegister.cashRegisterName.notBlank}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ]{3,}$", message = "{request.validation.createCashRegister.cashRegisterName.pattern}")
    String cashRegisterName
) {
}
