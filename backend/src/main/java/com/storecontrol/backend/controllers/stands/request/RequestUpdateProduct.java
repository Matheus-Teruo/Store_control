package com.storecontrol.backend.controllers.stands.request;

import jakarta.validation.constraints.NotNull;

public record RequestUpdateProduct(
    @NotNull
    String uuid,
    String productName,
    String price,
    Integer stock,
    String productImg,
    String standId
) {
}
