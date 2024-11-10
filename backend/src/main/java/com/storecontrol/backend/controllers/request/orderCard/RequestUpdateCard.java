package com.storecontrol.backend.controllers.request.orderCard;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record RequestUpdateCard(
    @NotNull
    @Pattern(regexp = "^[A-Za-z0-9]{15}$")
    String id,
    String debit,
    Boolean active
) {
}
