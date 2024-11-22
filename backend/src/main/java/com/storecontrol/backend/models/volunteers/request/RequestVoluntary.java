package com.storecontrol.backend.models.volunteers.request;

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
