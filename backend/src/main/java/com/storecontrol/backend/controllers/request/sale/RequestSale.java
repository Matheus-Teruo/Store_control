package com.storecontrol.backend.controllers.request.sale;

import com.storecontrol.backend.controllers.request.good.RequestGood;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record RequestSale(
    @NotNull
    Boolean onOrder,
    @NotNull
    List<RequestGood> requestGoods,
    @NotNull
    @Pattern(regexp = "^[A-Za-z0-9]{15}$")
    String orderCardId,
    @NotNull
    String voluntaryId
) {
}
