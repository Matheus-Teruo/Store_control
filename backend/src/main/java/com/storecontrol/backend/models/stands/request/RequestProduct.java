package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestProduct(
    @NotBlank(message = "Name of product is required")
    @Pattern(regexp = "^[A-Za-z0-9 ]+$", message = "Product name must contain only letters, numbers and space")
    String productName,

    @NotNull(message = "Product price is required")
    @PositiveOrZero(message = "Product cannot have a negative price")
    @Digits(integer = 5, fraction = 2, message = "The price must contain 2 decimal digits and a value below 5 digits")
    BigDecimal price,

    @NotNull(message = "Quantity in stock is required")
    @PositiveOrZero(message = "Product cannot have negative stock")
    Integer stock,

    String productImg,

    @NotNull(message = "Product must be related to a stand")
    UUID standId
) {
}
