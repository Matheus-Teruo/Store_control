package com.storecontrol.backend.controllers.request.voluntary;

import jakarta.validation.constraints.NotBlank;

public record RequestVoluntary(
    @NotBlank
    String uuid,
    @NotBlank
    String username,
    @NotBlank
    String fullname
) {
}
