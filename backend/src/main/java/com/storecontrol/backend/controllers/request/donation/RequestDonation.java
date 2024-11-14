package com.storecontrol.backend.controllers.request.donation;

import jakarta.validation.constraints.NotBlank;

public record RequestDonation(
    @NotBlank
    String donationValue,
    @NotBlank
    String orderCardId,
    @NotBlank
    String voluntaryId
) {
}
