package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RequestUpdatePurchase(
    @NotNull
    String uuid,
    Boolean onOrder,
    List<RequestUpdateItem> updateItems
) {
}
