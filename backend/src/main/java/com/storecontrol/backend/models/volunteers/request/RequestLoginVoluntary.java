package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RequestLoginVoluntary(
    @NotBlank(message = "Username is required")
    @Pattern(regexp = "^[A-Za-z0-9]{3,}$", message = "Username must contain only letters and numbers")
    String username,

    @NotBlank(message = "Password is required")
    String password
) {
}
