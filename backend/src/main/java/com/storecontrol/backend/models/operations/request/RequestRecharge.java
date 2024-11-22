package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestRecharge(
    @NotBlank
    String rechargeValue,
    @NotBlank
    String paymentTypeEnum,
    @NotBlank
    String orderCardId,
    @NotNull
    UUID cashRegisterId,
    @NotNull
    UUID voluntaryId
) {
}
