package com.storecontrol.backend.controllers.stands.request;

import jakarta.validation.constraints.NotBlank;

public record RequestStand(
    @NotBlank
    String standName,
    @NotBlank
    String associationId
) {
}
