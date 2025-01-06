package com.storecontrol.backend.models.customers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record RequestOrderCard(
    @NotNull(message = "{request.validation.orderCard.cardId.notnull}")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "{request.validation.orderCard.cardId.pattern}")
    String cardId
) {
}
