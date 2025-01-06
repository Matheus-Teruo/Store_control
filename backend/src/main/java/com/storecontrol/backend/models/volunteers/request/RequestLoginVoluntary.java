package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RequestLoginVoluntary(
    @NotBlank(message = "{request.validation.loginVoluntary.username.notBlank}")
    @Pattern(regexp = "^[A-Za-z0-9]{3,}$", message = "{request.validation.loginVoluntary.username.pattern}")
    String username,

    @NotBlank(message = "{request.validation.loginVoluntary.password.notBlank}")
    String password
) {
}
