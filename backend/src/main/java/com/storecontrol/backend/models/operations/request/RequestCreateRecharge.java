package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestCreateRecharge(
    @NotNull(message = "Recharge value is required")
    @Positive(message = "Recharge can't be zero or negative value")
    @Digits(integer = 5, fraction = 2, message = "The value must contain 2 decimal digits and a value below 5 digits")
    BigDecimal rechargeValue,

    @NotBlank(message = "PaymentType is required")
    String paymentTypeEnum,

    @NotBlank(message = "OrderCardId is required")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "Card ID must be exactly 15 normal characters")
    String orderCardId,

    @NotNull(message = "CashRegisterId is required")
    UUID cashRegisterUuid
) {
}
