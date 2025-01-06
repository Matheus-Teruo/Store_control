package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record RequestUpdateStand(
    @NotNull(message = "{request.validation.updateStand.uuid.notnull}")
    UUID uuid,

    @Pattern(regexp = "^[A-Za-z0-9 ]+$", message = "{request.validation.updateStand.standName.pattern}")
    String standName,

    UUID associationUuid
) {
}
