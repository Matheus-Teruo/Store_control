package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RequestCreateAssociation(
    @NotBlank(message = "{request.validation.createAssociation.associationName.notBlank}")
    @Size(min = 3, message = "{request.validation.createAssociation.associationName.size}")
    @Pattern(regexp = "^[\\p{L} ]*$", message = "{request.validation.createAssociation.associationName.pattern}")
    String associationName,

    @NotBlank(message = "{request.validation.createAssociation.principalName.notBlank}")
    @Size(min = 3, message = "{request.validation.createAssociation.principalName.size}")
    @Pattern(regexp = "^[\\p{L} ]*$", message = "{request.validation.createAssociation.principalName.pattern}")
    String principalName
) {
}
