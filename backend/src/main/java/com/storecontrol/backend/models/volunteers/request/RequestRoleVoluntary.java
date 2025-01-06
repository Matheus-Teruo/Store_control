package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestRoleVoluntary(
    @NotNull(message = "{request.validation.roleVoluntary.uuid.notnull}")
    UUID uuid,

    @NotBlank(message = "{request.validation.roleVoluntary.voluntaryRole.notBlank}")
    String voluntaryRole
) {
}
