package com.storecontrol.backend.models.operations.request;

import com.storecontrol.backend.models.operations.purchases.request.RequestCreateItem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record RequestCreateTrade(
    @NotNull(message = "{request.validation.createRecharge.rechargeValue.notnull}")
    @Positive(message = "{request.validation.createRecharge.rechargeValue.positive}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.createRecharge.rechargeValue.digits}")
    BigDecimal rechargeValue,

    @NotBlank(message = "{request.validation.createRecharge.paymentTypeEnum.notBlank}")
    String paymentTypeEnum,

    @NotBlank(message = "{request.validation.createRecharge.orderCardId.notBlank}")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "{request.validation.createRecharge.orderCardId.pattern}")
    String orderCardId,

    @NotNull(message = "{request.validation.createRecharge.cashRegisterUuid.notnull}")
    UUID cashRegisterUuid,

    @NotNull(message = "{request.validation.createPurchase.onOrder.notnull}")
    Boolean onOrder,

    @Valid
    @NotNull(message = "{request.validation.createPurchase.items.notnull}")
    List<RequestCreateItem> items
) {
}
