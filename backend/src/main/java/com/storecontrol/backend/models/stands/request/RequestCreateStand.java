package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RequestCreateStand(
    @NotBlank(message = "{request.validation.createStand.standName.notBlank}")
    @Size(min = 3, message = "{request.validation.createStand.standName.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ]*$", message = "{request.validation.createStand.standName.pattern}")
    String standName,

    @NotNull(message = "{request.validation.createStand.associationUuid.notnull}")
    UUID associationUuid
) {
}
