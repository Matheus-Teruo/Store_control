package com.storecontrol.backend.controllers.request.stand;

import com.storecontrol.backend.models.Association;
import jakarta.validation.constraints.NotNull;

public record RequestUpdateStand(
    @NotNull
    String uuid,
    String stand,
    Association association
) {
}
