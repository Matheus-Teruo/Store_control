package com.storecontrol.backend.models.customers.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestAuxFinalizeCustomer(
    @NotNull(message = "Debit is required")
    @PositiveOrZero(message = "Donation cannot have a negative value")
    @Digits(integer = 5, fraction = 2, message = "The increment must contain 2 decimal digits and a value below 5 digits")
    BigDecimal donationValue,

    @NotNull(message = "Refund is required")
    @PositiveOrZero(message = "Refund cannot have a negative value")
    @Digits(integer = 5, fraction = 2, message = "The increment must contain 2 decimal digits and a value below 5 digits")
    BigDecimal refundValue,

    @NotNull(message = "Card ID is required")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "Card ID must be exactly 15 normal characters")
    String orderCardId,

    @NotNull(message = "Cash register ID is required")
    String cashRegisterId,

    @NotNull(message = "Voluntary ID is required")
    UUID voluntaryId
) {
}
