package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RequestAssociation(
    @NotBlank(message = "Name of association is required")
    @Pattern(regexp = "^[A-Za-z]+$", message = "Association name must contain only letters")
    String associationName,

    @NotBlank(message = "Name of principal is required")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Principal name must contain only letters and space")
    String principalName
) {
}
