package com.storecontrol.backend.controllers.request.stand;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateStand(
    @NotNull
    String uuid,
    String standName,
    String associationId
) {
}
