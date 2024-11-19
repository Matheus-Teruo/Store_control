package com.storecontrol.backend.controllers.customers.request;

import jakarta.validation.constraints.NotBlank;

public record RequestAuxFinalizeCustomer(
    @NotBlank
    String donationValue,
    @NotBlank
    String refundValue,
    @NotBlank
    String orderCardId,
    @NotBlank
    String cashRegisterId,
    @NotBlank
    String voluntaryId
) {
}
