package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestUpdateVoluntaryFunction(
    @NotNull(message = "{request.validation.updateVoluntaryFunction.uuid.notnull}")
    UUID uuid,

    @NotNull(message = "{request.validation.updateVoluntaryFunction.functionUuid.notnull}")
    UUID functionUuid
) {
}
