package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.NotBlank;

public record RequestRecharge(
    @NotBlank
    String rechargeValue,
    @NotBlank
    String paymentTypeEnum,
    @NotBlank
    String orderCardId,
    @NotBlank
    String cashRegisterId,
    @NotBlank
    String voluntaryId
) {
}
