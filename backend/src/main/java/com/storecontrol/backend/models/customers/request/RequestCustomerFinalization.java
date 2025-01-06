package com.storecontrol.backend.models.customers.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestCustomerFinalization(
    @NotNull(message = "{request.validation.customer.donationValue.notnull}")
    @PositiveOrZero(message = "{request.validation.customer.donationValue.positiveOrZero}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.customer.donationValue.digits}")
    BigDecimal donationValue,

    @NotNull(message = "{request.validation.customer.refundValue.notnull}")
    @PositiveOrZero(message = "{request.validation.customer.refundValue.positiveOrZero}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.customer.refundValue.digits}")
    BigDecimal refundValue,

    @NotNull(message = "{request.validation.customer.orderCardId.notnull}")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "{request.validation.customer.orderCardId.pattern}")
    String orderCardId,

    @NotNull(message = "{request.validation.customer.cashRegisterUuid.notnull}")
    UUID cashRegisterUuid
) {
}
