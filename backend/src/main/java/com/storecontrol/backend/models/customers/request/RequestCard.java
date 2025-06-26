package com.storecontrol.backend.models.customers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record RequestCard(
    @NotNull(message = "{request.validation.card.cardId.notnull}")
    @Pattern(regexp = "^[A-Za-z0-9]{15}$", message = "{request.validation.card.cardId.pattern}")
    String cardId
) {
}
