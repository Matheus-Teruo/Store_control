package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;
import java.util.UUID;

public record RequestCreatePurchase(
    @NotNull(message = "{request.validation.createPurchase.standUuid.notnull}")
    UUID standUuid,

    @NotNull(message = "{request.validation.createPurchase.items.notnull}")
    List<RequestCreateItem> items,

    @NotNull(message = "{request.validation.createPurchase.cardId.notnull}")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "{request.validation.createPurchase.cardId.pattern}")
    String cardId
) {
}
