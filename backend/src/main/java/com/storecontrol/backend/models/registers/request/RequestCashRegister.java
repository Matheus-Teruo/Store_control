package com.storecontrol.backend.models.registers.request;

import jakarta.validation.constraints.NotBlank;

public record RequestCashRegister(
    @NotBlank
    String cashRegisterName
) {
}
