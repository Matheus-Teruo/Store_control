package com.storecontrol.backend.controllers.request.stand;

import jakarta.validation.constraints.NotBlank;

public record RequestStand(
    @NotBlank
    String standName,
    @NotBlank
    String associationId
) {
}
