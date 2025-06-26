package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record RequestUpdatePurchase(
    @NotNull(message = "{request.validation.updatePurchase.uuid.notnull}")
    UUID uuid,

    @NotNull(message = "{request.validation.updatePurchase.items.notnull}")
    List<RequestUpdateItem> items
) {
}
