package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RequestLoginVoluntary(
    @NotBlank(message = "{request.validation.loginVoluntary.username.notBlank}")
    @Pattern(regexp = "^[\\p{L}\\p{N}]{3,}$", message = "{request.validation.loginVoluntary.username.pattern}")
    String username,

    @NotBlank(message = "{request.validation.loginVoluntary.password.notBlank}")
    String password
) {
}
