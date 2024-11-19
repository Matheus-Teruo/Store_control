package com.storecontrol.backend.controllers.operations.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RequestItem(
    @NotBlank
    String productId,
    @NotNull
    Integer quantity,
    Integer delivered,
    @NotBlank
    String unitPrice
) {
}
