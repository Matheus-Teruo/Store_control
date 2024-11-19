package com.storecontrol.backend.controllers.operations.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record RequestPurchase(
    @NotNull
    Boolean onOrder,
    @NotNull
    List<RequestItem> items,
    @NotNull
    @Pattern(regexp = "^[A-Za-z0-9]{15}$")
    String orderCardId,
    @NotNull
    String voluntaryId
) {
}
