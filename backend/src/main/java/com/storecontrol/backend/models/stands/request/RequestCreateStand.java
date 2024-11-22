package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record RequestCreateStand(
    @NotBlank(message = "Name of stand is required")
    @Pattern(regexp = "^[A-Za-z0-9 ]+$", message = "Stand name must contain only letters, numbers and space")
    String standName,

    @NotNull(message = "Stand must be related to an association")
    UUID associationId
) {
}
