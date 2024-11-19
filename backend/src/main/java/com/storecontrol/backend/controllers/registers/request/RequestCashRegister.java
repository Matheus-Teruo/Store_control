package com.storecontrol.backend.controllers.registers.request;

import jakarta.validation.constraints.NotBlank;

public record RequestCashRegister(
    @NotBlank
    String cashRegisterName
) {
}
