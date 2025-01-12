package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RequestUpdateAssociation(
    @NotNull(message = "{request.validation.updateAssociation.uuid.notnull}")
    UUID uuid,

    @Size(min = 3, message = "{request.validation.updateAssociation.associationName.size}")
    @Pattern(regexp = "^[\\p{L} ]*$", message = "{request.validation.updateAssociation.associationName.pattern}")
    String associationName,

    @Size(min = 3, message = "{request.validation.updateAssociation.principalName.size}")
    @Pattern(regexp = "^[\\p{L} ]*$", message = "{request.validation.updateAssociation.principalName.pattern}")
    String principalName
) {
}
