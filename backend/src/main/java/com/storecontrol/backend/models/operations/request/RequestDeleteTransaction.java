package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestDeleteTransaction(
    @NotNull(message = "UUID is required")
    UUID uuid
) {
}
