package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RequestSignupVoluntary(
    @NotBlank(message = "{request.validation.signupVoluntary.username.notBlank}")
    @Pattern(regexp = "^[\\p{L}\\p{N}]{3,}$", message = "{request.validation.signupVoluntary.username.pattern}")
    String username,

    @NotBlank(message = "{request.validation.signupVoluntary.password.notBlank}")
    @Pattern(regexp = "^[\\w@#$%^&+=!]{8,}$", message = "{request.validation.signupVoluntary.password.pattern}")
    String password,

    @NotBlank(message = "{request.validation.signupVoluntary.fullname.notBlank}")
    @Pattern(regexp = "^[\\p{L} ]{3,}$", message = "{request.validation.signupVoluntary.fullname.pattern}")
    String fullname
) {
}
