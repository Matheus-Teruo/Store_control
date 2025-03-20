package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record RequestUpdatePurchase(
    @NotNull(message = "{request.validation.updatePurchase.uuid.notnull}")
    UUID uuid,

    Boolean onOrder,

    List<RequestUpdateItem> updateItems
) {
}
