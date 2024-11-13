package com.storecontrol.backend.controllers.request.association;

import jakarta.validation.constraints.NotBlank;

public record RequestAssociation(
    @NotBlank
    String associationName,
    @NotBlank
    String principalName
) {
}
