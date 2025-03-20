package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestCreateItem(
    @NotNull(message = "{request.validation.createItem.productUuid.notnull}")
    UUID productUuid,

    @NotNull(message = "{request.validation.createItem.quantity.notnull}")
    @PositiveOrZero(message = "{request.validation.createItem.quantity.positiveOrZero}")
    Integer quantity,

    @NotNull(message = "{request.validation.createItem.delivered.notnull}")
    @PositiveOrZero(message = "{request.validation.createItem.delivered.positiveOrZero}")
    Integer delivered,

    @NotNull(message = "{request.validation.createItem.unitPrice.notnull}")
    @PositiveOrZero(message = "{request.validation.createItem.unitPrice.positiveOrZero}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.createItem.unitPrice.digits}")
    BigDecimal unitPrice,

    @NotNull(message = "{request.validation.createItem.discount.notnull}")
    @PositiveOrZero(message = "{request.validation.createItem.discount.positiveOrZero}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.createItem.discount.digits}")
    BigDecimal discount
) {
}
