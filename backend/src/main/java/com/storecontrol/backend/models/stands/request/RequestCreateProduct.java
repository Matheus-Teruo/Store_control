package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestCreateProduct(
    @NotBlank(message = "{request.validation.createProduct.productName.notBlank}")
    @Size(min = 3, message = "{request.validation.createProduct.productName.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ]*$", message = "{request.validation.createProduct.productName.pattern}")
    String productName,

    @Size(min= 3, max = 255, message = "{request.validation.createProduct.summary.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ,.!()?]*$", message = "{request.validation.createProduct.summary.pattern}")
    String summary,

    @Size(min = 30, message = "{request.validation.createProduct.description.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ,.!()?]*$", message = "{request.validation.createProduct.description.pattern}")
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
