package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestCreateProduct(
    @NotBlank(message = "{request.validation.createProduct.productName.notBlank}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ]{3,}$", message = "{request.validation.createProduct.productName.pattern}")
    String productName,

    @Size(max = 255, message = "{request.validation.createProduct.summary.size}")
    String summary,

    String description,

    @NotNull(message = "{request.validation.createProduct.price.notnull}")
    @PositiveOrZero(message = "{request.validation.createProduct.price.positiveOrZero}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.createProduct.price.digits}")
    BigDecimal price,

    @NotNull(message = "{request.validation.createProduct.stock.notnull}")
    @PositiveOrZero(message = "{request.validation.createProduct.stock.positiveOrZero}")
    Integer stock,

    String productImg,

    @NotNull(message = "{request.validation.createProduct.standUuid.notnull}")
    UUID standUuid
) {
}
