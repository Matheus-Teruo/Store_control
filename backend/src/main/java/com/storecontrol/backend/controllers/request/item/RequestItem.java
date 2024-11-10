package com.storecontrol.backend.controllers.request.item;

import com.storecontrol.backend.models.Stand;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record RequestItem(
    @NotBlank
    String itemName,
    @NotBlank
    BigDecimal price,
    @NotBlank
    Integer stock,
    String itemImg,
    @NotNull
    Stand stand
) {
}
