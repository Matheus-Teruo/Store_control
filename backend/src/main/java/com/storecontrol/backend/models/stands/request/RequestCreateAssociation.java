package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RequestCreateAssociation(
    @NotBlank(message = "{request.validation.createAssociation.associationName.notBlank}")
    @Pattern(regexp = "^[A-Za-z]+$", message = "{request.validation.createAssociation.associationName.pattern}")
    String associationName,

    @NotBlank(message = "{request.validation.createAssociation.principalName.notBlank}")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "{request.validation.createAssociation.principalName.pattern}")
    String principalName
) {
}
