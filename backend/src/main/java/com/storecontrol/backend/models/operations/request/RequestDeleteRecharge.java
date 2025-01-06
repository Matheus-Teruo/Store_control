package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestDeleteRecharge(
    @NotNull(message = "{request.validation.deleteRecharge.uuid.notnull}")
    UUID uuid
) {
}
