package com.storecontrol.backend.controllers.request.sale;

import com.storecontrol.backend.controllers.request.good.RequestUpdateGood;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RequestUpdateSale(
    @NotNull
    String uuid,
    Boolean onOrder,
    List<RequestUpdateGood> requestUpdateGoods
) {
}
