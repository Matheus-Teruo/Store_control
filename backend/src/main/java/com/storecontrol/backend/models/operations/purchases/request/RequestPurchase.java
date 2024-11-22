package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;
import java.util.UUID;

public record RequestPurchase(
    @NotNull
    Boolean onOrder,
    @NotNull
    List<RequestItem> items,
    @NotNull
    @Pattern(regexp = "^[A-Za-z0-9]{15}$")
    String orderCardId,
    @NotNull
    UUID voluntaryId
) {
}
