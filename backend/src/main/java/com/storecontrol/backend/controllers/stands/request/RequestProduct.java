package com.storecontrol.backend.controllers.stands.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RequestProduct(
    @NotBlank
    String productName,
    @NotBlank
    String price,
    @NotNull
    Integer stock,
    String productImg,
    @NotBlank
    String standId
) {
}
