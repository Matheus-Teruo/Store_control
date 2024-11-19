package com.storecontrol.backend.controllers.volunteers.request;

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
