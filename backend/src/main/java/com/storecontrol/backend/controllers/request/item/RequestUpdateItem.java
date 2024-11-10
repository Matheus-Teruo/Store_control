package com.storecontrol.backend.controllers.request.item;

import com.storecontrol.backend.models.Stand;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record RequestUpdateItem(
    @NotNull
    String uuid,
    String itemName,
    BigDecimal price,
    Integer stock,
    String itemImg,
    Stand stand
) {
}
