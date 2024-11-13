package com.storecontrol.backend.controllers.request.association;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateAssociation(
    @NotNull
    String uuid,
    String associationName,
    String principalName
) {
}
