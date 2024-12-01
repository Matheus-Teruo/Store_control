package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestRoleVoluntary(
    @NotNull(message = "UUID is required")
    UUID uuid,

    String voluntaryRole
) {
}
