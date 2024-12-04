package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestUpdateVoluntaryFunction(
    @NotNull(message = "UUID is required")
    UUID uuid,

    @NotNull(message = "FunctionUUID is required")
    UUID functionUuid
) {
}
