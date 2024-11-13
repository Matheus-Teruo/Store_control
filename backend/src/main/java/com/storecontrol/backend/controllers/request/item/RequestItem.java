package com.storecontrol.backend.controllers.request.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RequestItem(
    @NotBlank
    String itemName,
    @NotBlank
    String price,
    @NotNull
    Integer stock,
    String itemImg,
    @NotBlank
    String standId
) {
}
