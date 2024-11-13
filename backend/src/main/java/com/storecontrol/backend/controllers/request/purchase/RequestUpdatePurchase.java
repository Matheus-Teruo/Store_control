package com.storecontrol.backend.controllers.request.purchase;

import com.storecontrol.backend.controllers.request.good.RequestUpdateGood;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RequestUpdatePurchase(
    @NotNull
    String uuid,
    Boolean onOrder,
    List<RequestUpdateGood> requestUpdateGoods
) {
}
