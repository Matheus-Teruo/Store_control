package com.storecontrol.backend.controllers.request.customer;

import jakarta.validation.constraints.NotBlank;

public record RequestAuxFinalizeCustomer(
    @NotBlank
    String donationValue,
    @NotBlank
    String refundValue,
    @NotBlank
    String orderCardId,
    @NotBlank
    String voluntaryId
) {
}
