package com.storecontrol.backend.controllers.request.stand;

import com.storecontrol.backend.models.Association;
import jakarta.validation.constraints.NotBlank;

public record RequestStand(
    @NotBlank
    String stand,
    @NotBlank
    Association association
) {
}
