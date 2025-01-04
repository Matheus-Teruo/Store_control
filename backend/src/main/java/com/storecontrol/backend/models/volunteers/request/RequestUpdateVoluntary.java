package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record RequestUpdateVoluntary(
    @NotNull(message = "UUID is required")
    UUID uuid,

    @Pattern(regexp = "^[A-Za-z0-9]{3,}$", message = "Username must contain only letters and numbers")
    String username,

    String password,

    @Pattern(regexp = "^[A-Za-z ]{3,}$", message = "Fullname must contain only letters and space")
    String fullname
) {
}
