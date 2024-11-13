package com.storecontrol.backend.controllers.request.recharge;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateRecharge(
    @NotNull
    String uuid,
    String rechargeValue,
    String paymentTypeEnum
) {
}
