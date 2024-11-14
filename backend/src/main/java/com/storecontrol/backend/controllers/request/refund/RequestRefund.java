package com.storecontrol.backend.controllers.request.refund;

import jakarta.validation.constraints.NotBlank;

public record RequestRefund(
    @NotBlank
    String refundValue,
    @NotBlank
    String orderCardId,
    @NotBlank
    String voluntaryId
) {
}
