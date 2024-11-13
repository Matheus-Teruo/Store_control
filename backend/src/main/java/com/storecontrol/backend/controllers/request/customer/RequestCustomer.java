package com.storecontrol.backend.controllers.request.customer;

import com.storecontrol.backend.controllers.request.orderCard.RequestUpdateOrderCard;
import jakarta.validation.constraints.NotNull;

public record RequestCustomer(
    @NotNull
    RequestUpdateOrderCard orderCard
) {
}
