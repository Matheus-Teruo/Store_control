package com.storecontrol.backend.controllers.stands.request;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateStand(
    @NotNull
    String uuid,
    String standName,
    String associationId
) {
}
