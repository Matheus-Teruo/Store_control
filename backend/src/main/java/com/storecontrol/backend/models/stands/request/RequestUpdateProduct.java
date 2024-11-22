package com.storecontrol.backend.models.stands.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record RequestUpdateProduct(
    @NotNull(message = "UUID is required")
    UUID uuid,

    @Pattern(regexp = "^[A-Za-z0-9 ]+$", message = "Nome de produto deve conter apenas letras, números e espaços")
    String productName,

    @PositiveOrZero(message = "Product cannot have a negative price")
    @Digits(integer = 5, fraction = 2, message = "The price must contain 2 decimal digits and a value below 5 digits")
    BigDecimal price,

    @PositiveOrZero(message = "Product cannot have negative stock")
    Integer stock,

    String productImg,

    UUID standId
) {
}
