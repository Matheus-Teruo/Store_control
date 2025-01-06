package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RequestSignupVoluntary(
    @NotBlank(message = "{request.validation.signupVoluntary.username.notBlank}")
    @Pattern(regexp = "^[A-Za-z0-9]{3,}$", message = "{request.validation.signupVoluntary.username.pattern}")
    String username,

    @NotBlank(message = "{request.validation.signupVoluntary.password.notBlank}")
    String password,

    @NotBlank(message = "{request.validation.signupVoluntary.fullname.notBlank}")
    @Pattern(regexp = "^[A-Za-z ]{3,}$", message = "{request.validation.signupVoluntary.fullname.pattern}")
    String fullname
) {
}
