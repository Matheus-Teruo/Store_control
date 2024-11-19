package com.storecontrol.backend.controllers.operations.request;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateRecharge(
    @NotNull
    String uuid,
    String paymentTypeEnum
) {
}
