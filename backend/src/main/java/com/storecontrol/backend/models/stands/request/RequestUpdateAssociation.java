package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record RequestUpdateAssociation(
    @NotNull(message = "{request.validation.updateAssociation.uuid.notnull}")
    UUID uuid,

    @Pattern(regexp = "^[A-Za-z]+$", message = "{request.validation.updateAssociation.associationName.pattern}")
    String associationName,

    @Pattern(regexp = "^[A-Za-z ]+$", message = "{request.validation.updateAssociation.principalName.pattern}")
    String principalName
) {
}
