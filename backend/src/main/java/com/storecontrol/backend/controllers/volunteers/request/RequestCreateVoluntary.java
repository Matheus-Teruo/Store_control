package com.storecontrol.backend.controllers.volunteers.request;

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
