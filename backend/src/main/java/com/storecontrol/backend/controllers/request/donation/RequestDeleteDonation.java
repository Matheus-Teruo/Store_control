package com.storecontrol.backend.controllers.request.donation;

import jakarta.validation.constraints.NotBlank;

public record RequestDeleteDonation(
    @NotBlank
    String uuid
) {
}
