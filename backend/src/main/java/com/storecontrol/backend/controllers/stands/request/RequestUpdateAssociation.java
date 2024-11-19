package com.storecontrol.backend.controllers.stands.request;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateAssociation(
    @NotNull
    String uuid,
    String associationName,
    String principalName
) {
}
