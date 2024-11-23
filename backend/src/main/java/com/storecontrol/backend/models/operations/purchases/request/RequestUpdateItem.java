package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestUpdateItem(
    @NotNull(message = "UUID of product is required")
    UUID productId,

    Integer delivered
) {
}
