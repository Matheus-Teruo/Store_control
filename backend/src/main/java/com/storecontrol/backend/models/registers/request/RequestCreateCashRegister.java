package com.storecontrol.backend.models.registers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RequestCreateCashRegister(
    @NotBlank(message = "Name of register is required")
    @Pattern(regexp = "^[A-Za-z0-9 ]+$", message = "Register name must contain only letters, numbers and space")
    String cashRegisterName
) {
}
