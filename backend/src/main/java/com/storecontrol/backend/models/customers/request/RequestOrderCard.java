package com.storecontrol.backend.models.customers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record RequestOrderCard(
    @NotNull(message = "Card ID is required")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "Card ID must be exactly 15 normal characters")
    String cardId
) {
}
