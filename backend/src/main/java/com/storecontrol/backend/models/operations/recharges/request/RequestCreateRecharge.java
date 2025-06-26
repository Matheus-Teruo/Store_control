package com.storecontrol.backend.models.operations.recharges.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestCreateRecharge(
    @NotNull(message = "{request.validation.createRecharge.rechargeValue.notnull}")
    @PositiveOrZero(message = "{request.validation.createRecharge.rechargeValue.positiveOrZero}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.createRecharge.rechargeValue.digits}")
    BigDecimal rechargeValue,

    @NotBlank(message = "{request.validation.createRecharge.paymentTypeEnum.notBlank}")
    String paymentTypeEnum,

    @NotBlank(message = "{request.validation.createRecharge.cardId.notBlank}")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "{request.validation.createRecharge.cardId.pattern}")
    String cardId,

    @NotNull(message = "{request.validation.createRecharge.registerUuid.notnull}")
    UUID registerUuid
) {
}
