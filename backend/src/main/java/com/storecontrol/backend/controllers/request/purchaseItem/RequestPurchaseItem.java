package com.storecontrol.backend.controllers.request.purchaseItem;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RequestPurchaseItem(
    @NotBlank
    String productId,
    @NotNull
    Integer quantity,
    Integer delivered,
    @NotBlank
    String unitPrice
) {
}
