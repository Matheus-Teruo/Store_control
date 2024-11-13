package com.storecontrol.backend.controllers.request.recharge;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RequestRecharge(
    @NotNull
    String rechargeValue,
    @NotNull
    String paymentTypeEnum,
    @NotBlank
    String orderCardId,
    @NotNull
    String voluntaryId
) {
}
