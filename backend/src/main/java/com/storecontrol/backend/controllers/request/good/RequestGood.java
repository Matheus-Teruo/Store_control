package com.storecontrol.backend.controllers.request.good;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RequestGood(
    @NotBlank
    String itemId,
    @NotNull
    Integer quantity,
    Integer delivered,
    @NotBlank
    String unitPrice
) {
}
