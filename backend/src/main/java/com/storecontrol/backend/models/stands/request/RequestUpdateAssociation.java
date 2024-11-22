package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record RequestUpdateAssociation(
    @NotNull(message = "UUID is required")
    UUID uuid,

    @Pattern(regexp = "^[A-Za-z]+$", message = "Association name must contain only letters")
    String associationName,

    @Pattern(regexp = "^[A-Za-z ]+$", message = "Principal name must contain only letters and space")
    String principalName
) {
}
