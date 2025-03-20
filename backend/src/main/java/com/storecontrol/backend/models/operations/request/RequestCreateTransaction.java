package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestCreateTransaction(
    @NotNull(message = "{request.validation.createTransaction.amount.notnull}")
    @Positive(message = "{request.validation.createTransaction.amount.positive}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.createTransaction.amount.digits}")
    BigDecimal amount,

    @NotBlank(message = "{request.validation.createTransaction.transactionTypeEnum.notBlank}")
    String transactionTypeEnum,

    @NotNull(message = "{request.validation.createTransaction.cashRegisterUuid.notnull}")
    UUID cashRegisterUuid
) {
}
