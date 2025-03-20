package com.storecontrol.backend.models.registers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RequestCreateCashRegister(
    @NotBlank(message = "{request.validation.createCashRegister.cashRegisterName.notBlank}")
    @Size(min = 3, message = "{request.validation.createCashRegister.cashRegisterName.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ]{3,}$", message = "{request.validation.createCashRegister.cashRegisterName.pattern}")
    String cashRegisterName
) {
}
