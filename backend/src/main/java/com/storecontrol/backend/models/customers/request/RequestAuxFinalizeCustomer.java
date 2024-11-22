package com.storecontrol.backend.models.customers.request;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

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
    UUID voluntaryId
) {
}
