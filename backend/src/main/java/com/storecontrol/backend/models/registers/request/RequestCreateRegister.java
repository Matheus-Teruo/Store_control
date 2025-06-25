package com.storecontrol.backend.models.registers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RequestCreateRegister(
    @NotBlank(message = "{request.validation.createRegister.registerName.notBlank}")
    @Size(min = 3, message = "{request.validation.createRegister.registerName.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ]{3,}$", message = "{request.validation.createRegister.registerName.pattern}")
    String registerName,

    UUID standUuid
) {
}
