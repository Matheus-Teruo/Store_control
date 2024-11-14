package com.storecontrol.backend.controllers.request.purchaseItem;

import jakarta.validation.constraints.NotBlank;

public record RequestUpdatePurchaseItem(
    @NotBlank
    String productId,
    Integer delivered
) {
}
