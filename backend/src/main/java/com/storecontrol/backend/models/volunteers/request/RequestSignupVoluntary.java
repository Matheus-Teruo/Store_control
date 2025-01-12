package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RequestSignupVoluntary(
    @NotBlank(message = "{request.validation.signupVoluntary.username.notBlank}")
    @Size(min = 3, message = "{request.validation.signupVoluntary.username.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N}]*$", message = "{request.validation.signupVoluntary.username.pattern}")
    String username,

    @NotBlank(message = "{request.validation.signupVoluntary.password.notBlank}")
    @Size(min = 8, message = "{request.validation.signupVoluntary.password.size}")
    @Pattern(regexp = "^[\\w@#$%^&+=!]*$", message = "{request.validation.signupVoluntary.password.pattern}")
    String password,

    @NotBlank(message = "{request.validation.signupVoluntary.fullname.notBlank}")
    @Size(min = 3, message = "{request.validation.signupVoluntary.fullname.size}")
    @Pattern(regexp = "^[\\p{L} ]*$", message = "{request.validation.signupVoluntary.fullname.pattern}")
    String fullname
) {
}
