package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RequestLoginVoluntary(
    @NotBlank(message = "{request.validation.loginVoluntary.username.notBlank}")
    @Size(min = 3, message = "{request.validation.loginVoluntary.username.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N}]*$", message = "{request.validation.loginVoluntary.username.pattern}")
    String username,

    @NotBlank(message = "{request.validation.loginVoluntary.password.notBlank}")
    String password
) {
}
