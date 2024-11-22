package com.storecontrol.backend.models.operations.purchases.request;

import jakarta.validation.constraints.NotBlank;

public record RequestUpdateItem(
    @NotBlank
    String productId,
    Integer delivered
) {
}
