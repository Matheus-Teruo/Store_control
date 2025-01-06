package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.UUID;

public record RequestUpdateItem(
    @NotNull(message = "{request.validation.updateItem.productUuid.notnull}")
    UUID productUuid,

    @PositiveOrZero(message = "{request.validation.updateItem.delivered.positiveOrZero}")
    Integer delivered
) {
}
