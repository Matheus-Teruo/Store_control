package com.storecontrol.backend.controllers.request.association;

import com.storecontrol.backend.models.Stand;
import com.storecontrol.backend.models.Voluntary;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RequestUpdateAssociation(
    @NotNull
    String uuid,
    String association,
    String principalName,
    Voluntary principal,
    List<Stand> stands
) {
}
