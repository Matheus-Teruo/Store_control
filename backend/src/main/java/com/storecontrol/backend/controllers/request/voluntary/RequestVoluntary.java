package com.storecontrol.backend.controllers.request.voluntary;

import jakarta.validation.constraints.NotBlank;

public record RequestVoluntary(
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
