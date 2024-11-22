package com.storecontrol.backend.models.customers.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record RequestOrderCard(
    @NotNull
    @Pattern(regexp = "^[A-Za-z0-9]{15}$")
    String id
) {
}
