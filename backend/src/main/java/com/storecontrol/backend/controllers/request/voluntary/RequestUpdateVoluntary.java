package com.storecontrol.backend.controllers.request.voluntary;

import com.storecontrol.backend.models.Association;
import com.storecontrol.backend.models.Stand;
import jakarta.validation.constraints.NotNull;

public record RequestUpdateVoluntary(
    @NotNull
    String uuid,
    String username,
    String password,
    String salt,
    String fullname,
    String associationId,
    String standId,
    Boolean superUser
) {
}
