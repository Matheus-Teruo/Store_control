package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateRecharge(
    @NotNull
    String uuid,
    String paymentTypeEnum
) {
}
