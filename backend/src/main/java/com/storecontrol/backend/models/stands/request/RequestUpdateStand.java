package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record RequestUpdateStand(
    @NotNull(message = "UUID is required")
    UUID uuid,

    @Pattern(regexp = "^[A-Za-z ]+$", message = "Stand name must contain only letters and space")
    String standName,

    UUID associationId
) {
}
