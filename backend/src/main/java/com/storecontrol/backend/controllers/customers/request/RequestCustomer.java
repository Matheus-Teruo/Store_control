package com.storecontrol.backend.controllers.customers.request;

import jakarta.validation.constraints.NotNull;

public record RequestCustomer(
    @NotNull
    RequestUpdateOrderCard orderCard
) {
}
