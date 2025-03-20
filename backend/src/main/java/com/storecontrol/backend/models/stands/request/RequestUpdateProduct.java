package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestUpdateProduct(
    @NotNull(message = "{request.validation.updateProduct.uuid.notnull}")
    UUID uuid,

    @Size(min = 3, message = "{request.validation.updateProduct.productName.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ]*$", message = "{request.validation.updateProduct.productName.pattern}")
    String productName,

    @Size(min=3, max = 255, message = "{request.validation.updateProduct.summary.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ,.!()?]*$", message = "{request.validation.updateProduct.summary.pattern}")
    String summary,

    @Size(min = 30, message = "{request.validation.updateProduct.description.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} ,.!()?]*$", message = "{request.validation.updateProduct.description.pattern}")
    String description,

    @PositiveOrZero(message = "{request.validation.updateProduct.price.positiveOrZero}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.updateProduct.price.digits}")
    BigDecimal price,

    @PositiveOrZero(message = "{request.validation.updateProduct.discount.positiveOrZero}")
    @Digits(integer = 5, fraction = 2, message = "{request.validation.updateProduct.discount.digits}")
    BigDecimal discount,

    @PositiveOrZero(message = "{request.validation.updateProduct.stock.positiveOrZero}")
    Integer stock,

    String productImg,

    UUID standUuid
) {
}
