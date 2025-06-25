package com.storecontrol.backend.models.operations.trades.request;

import com.storecontrol.backend.models.operations.purchases.request.RequestCreateItem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record RequestCreateTrade(
    @NotNull(message = "{request.validation.createRecharge.rechargeValue.notnull}")
    @PositiveOrZero(message = "{request.validation.createRecharge.rechargeValue.positiveOrZero}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.createRecharge.rechargeValue.digits}")
    BigDecimal rechargeValue,

    @NotBlank(message = "{request.validation.createRecharge.paymentTypeEnum.notBlank}")
    String paymentTypeEnum,

    @NotBlank(message = "{request.validation.createRecharge.orderCardId.notBlank}")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "{request.validation.createRecharge.orderCardId.pattern}")
    String orderCardId,

    @NotNull(message = "{request.validation.createPurchase.onOrder.notnull}")
    Boolean onOrder,

    @NotNull(message = "{request.validation.createPurchase.standUuid.notnull}")
    UUID standUuid,

    @Valid
    @NotNull(message = "{request.validation.createPurchase.items.notnull}")
    List<RequestCreateItem> items
) {
}
