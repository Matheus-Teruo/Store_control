package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotBlank;

public record RequestCreateVoluntary(
    @NotBlank
    String username,
    @NotBlank
    String password,
    @NotBlank
    String salt,
    @NotBlank
    String fullname
) {
}
