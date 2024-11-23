package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record RequestUpdatePurchase(
    @NotNull(message = "UUID is required")
    UUID uuid,

    Boolean onOrder,

    List<RequestUpdateItem> updateItems
) {
}
