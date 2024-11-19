package com.storecontrol.backend.controllers.customers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record RequestUpdateOrderCard(
    @NotNull
    @Pattern(regexp = "^[A-Za-z0-9]{15}$")
    String id,
    String debit
) {
}
