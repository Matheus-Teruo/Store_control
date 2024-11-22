package com.storecontrol.backend.models.customers.request;

import jakarta.validation.constraints.NotNull;

public record RequestCustomer(
    @NotNull(message = "orderCard is required")
    RequestUpdateOrderCard orderCard
) {
}
