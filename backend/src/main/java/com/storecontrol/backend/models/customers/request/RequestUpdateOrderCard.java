package com.storecontrol.backend.models.customers.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record RequestUpdateOrderCard(
    @NotNull(message = "Card ID is required")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "Card ID must be exactly 15 normal characters")
    String id,

    @NotNull(message = "Debit is required")
    @PositiveOrZero(message = "Debit cannot have a negative value")
    @Digits(integer = 5, fraction = 2, message = "The increment must contain 2 decimal digits and a value below 5 digits")
    BigDecimal debitIncrement
) {
}
