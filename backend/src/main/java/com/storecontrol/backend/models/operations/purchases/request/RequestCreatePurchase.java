package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record RequestCreatePurchase(
    @NotNull(message = "{request.validation.createPurchase.onOrder.notnull}")
    Boolean onOrder,

    @Valid
    @NotNull(message = "{request.validation.createPurchase.items.notnull}")
    List<RequestCreateItem> items,

    @NotNull(message = "{request.validation.createPurchase.orderCardId.notnull}")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "{request.validation.createPurchase.orderCardId.pattern}")
    String orderCardId
) {
}
