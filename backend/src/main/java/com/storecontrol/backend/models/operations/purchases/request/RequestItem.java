package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestItem(
    @NotNull
    UUID productId,
    @NotNull
    Integer quantity,
    Integer delivered,
    @NotBlank
    String unitPrice
) {
}
