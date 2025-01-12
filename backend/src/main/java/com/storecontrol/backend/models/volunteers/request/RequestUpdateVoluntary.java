package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record RequestUpdateVoluntary(
    @NotNull(message = "{request.validation.updateVoluntary.uuid.notnull}")
    UUID uuid,

    @Pattern(regexp = "^[\\p{L}\\p{N}]{3,}$", message = "{request.validation.updateVoluntary.username.pattern}")
    String username,

    @Pattern(regexp = "^[\\w@#$%^&+=!]{8,}$", message = "{request.validation.signupVoluntary.password.pattern}")
    String password,

    @Pattern(regexp = "^[\\p{L} ]{3,}$", message = "{request.validation.updateVoluntary.fullname.pattern}")
    String fullname
) {
}
