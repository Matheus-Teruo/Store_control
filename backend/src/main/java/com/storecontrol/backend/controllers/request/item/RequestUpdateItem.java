package com.storecontrol.backend.controllers.request.item;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateItem(
    @NotNull
    String uuid,
    String itemName,
    String price,
    Integer stock,
    String itemImg,
    String standId
) {
}
