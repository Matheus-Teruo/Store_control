package com.storecontrol.backend.controllers.request.item;

import jakarta.validation.constraints.NotBlank;

public record RequestUpdateItem(
    @NotBlank
    String productId,
    Integer delivered
) {
}
