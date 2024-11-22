package com.storecontrol.backend.models.volunteers.request;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateVoluntary(
    @NotNull
    String uuid,
    String username,
    String password,
    String salt,
    String fullname,
    String standId
) {
}
