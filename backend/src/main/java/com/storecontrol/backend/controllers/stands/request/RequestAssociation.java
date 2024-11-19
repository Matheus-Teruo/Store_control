package com.storecontrol.backend.controllers.stands.request;

import jakarta.validation.constraints.NotBlank;

public record RequestAssociation(
    @NotBlank
    String associationName,
    @NotBlank
    String principalName
) {
}
