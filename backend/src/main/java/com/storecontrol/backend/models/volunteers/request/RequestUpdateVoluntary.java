package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RequestUpdateVoluntary(
    @NotNull(message = "{request.validation.updateVoluntary.uuid.notnull}")
    UUID uuid,

    @Size(min = 3, message = "{request.validation.updateVoluntary.username.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N}]*$", message = "{request.validation.updateVoluntary.username.pattern}")
    String username,

    @Size(min = 8, message = "{request.validation.updateVoluntary.password.size}")
    @Pattern(regexp = "^[\\w@#$%^&+=!]*$", message = "{request.validation.signupVoluntary.password.pattern}")
    String password,

    @Size(min = 3, message = "{request.validation.updateVoluntary.fullname.size}")
    @Pattern(regexp = "^[\\p{L} ]*$", message = "{request.validation.updateVoluntary.fullname.pattern}")
    String fullname
) {
}
