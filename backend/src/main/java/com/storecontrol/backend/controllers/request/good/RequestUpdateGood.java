package com.storecontrol.backend.controllers.request.good;

import jakarta.validation.constraints.NotBlank;

public record RequestUpdateGood(
    @NotBlank
    String itemId,
    Integer delivered
) {
}
