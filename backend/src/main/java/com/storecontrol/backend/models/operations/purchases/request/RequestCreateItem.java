package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestCreateItem(
    @NotNull(message = "UUID of product is required")
    UUID productId,

    @NotNull(message = "quantity is required")
    @PositiveOrZero(message = "quantity cannot have a negative value")
    Integer quantity,

    @NotNull(message = "delivered is required")
    @PositiveOrZero(message = "delivered cannot have a negative value")
    Integer delivered,

    @NotNull(message = "Unit price is required")
    @PositiveOrZero(message = "Unit price cannot have a negative price")
    @Digits(integer = 5, fraction = 2, message = "The unit price must contain 2 decimal digits and a value below 5 digits")
    BigDecimal unitPrice
) {
}
