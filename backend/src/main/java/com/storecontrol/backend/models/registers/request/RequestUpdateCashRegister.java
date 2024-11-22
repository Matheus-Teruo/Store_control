package com.storecontrol.backend.models.registers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record RequestUpdateCashRegister(
    @NotNull(message = "UUID is required")
    UUID uuid,

    @Pattern(regexp = "^[A-Za-z0-9 ]+$", message = "Register name must contain only letters, numbers and space")
    String cashRegisterName
) {
}
