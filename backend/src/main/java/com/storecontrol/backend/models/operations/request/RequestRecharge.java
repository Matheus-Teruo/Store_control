package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

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
    UUID voluntaryId
) {
}
