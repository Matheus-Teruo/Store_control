package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record RequestUpdateVoluntary(
    @NotNull(message = "{request.validation.updateVoluntary.uuid.notnull}")
    UUID uuid,

    @Pattern(regexp = "^[A-Za-z0-9]{3,}$", message = "{request.validation.updateVoluntary.username.pattern}")
    String username,

    String password,

    @Pattern(regexp = "^[A-Za-z ]{3,}$", message = "{request.validation.updateVoluntary.fullname.pattern}")
    String fullname
) {
}
