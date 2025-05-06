package com.storecontrol.backend.models.registers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RequestUpdateRegister(
    @NotNull(message = "{request.validation.updateRegister.uuid.notnull}")
    UUID uuid,

    @Size(min = 3, message = "{request.validation.updateRegister.registerName.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ]{3,}$", message = "{request.validation.updateRegister.registerName.pattern}")
    String registerName
) {
}
