package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record RequestCreatePurchase(
    @NotNull(message = "OnOrder boolean value is required")
    Boolean onOrder,

    @Valid
    @NotNull(message = "Items is required")
    List<RequestCreateItem> items,

    @NotNull(message = "OrderCardId is required")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$")
    String orderCardId
) {
}
