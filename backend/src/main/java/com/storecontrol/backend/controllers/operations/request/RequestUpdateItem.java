package com.storecontrol.backend.controllers.operations.request;

import jakarta.validation.constraints.NotBlank;

public record RequestUpdateItem(
    @NotBlank
    String productId,
    Integer delivered
) {
}
