package com.storecontrol.backend.controllers.request.association;

import com.storecontrol.backend.models.Voluntary;
import jakarta.validation.constraints.NotBlank;

public record RequestAssociation(
    @NotBlank
    String association,
    @NotBlank
    String principalName,
    Voluntary principal
) {
}
