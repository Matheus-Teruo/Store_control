package com.storecontrol.backend.models.stands.products.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.UUID;

public record RequestCreateProductCombo(
    @NotNull(message = "{request.validation.createCombo.includedUuid.notnull}")
    UUID includedProductUuid,

    @PositiveOrZero(message = "{request.validation.createCombo.quantity.positiveOrZero}")
    Integer quantity
) {
}
