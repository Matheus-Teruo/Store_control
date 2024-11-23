package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestCreateTransaction(
    @NotNull(message = "Transaction amount value is required")
    @Positive(message = "Amount can't be zero or negative value")
    @Digits(integer = 5, fraction = 2, message = "The value must contain 2 decimal digits and a value below 5 digits")
    BigDecimal amount,

    @NotBlank(message = "TransactionType is required")
    String transactionTypeEnum,

    @NotNull(message = "Cash Register ID is required")
    UUID cashRegisterId,

    @NotNull(message = "Voluntary ID is required")
    UUID voluntaryId
) {
}
