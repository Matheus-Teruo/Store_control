package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestPasswordVoluntary(
    @NotNull(message = "{request.validation.updateVoluntaryPassword.uuid.notnull}")
    UUID uuid
) {
}
