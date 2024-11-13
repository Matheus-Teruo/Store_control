package com.storecontrol.backend.controllers.response.good;

import com.storecontrol.backend.models.Good;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseGood(
    UUID itemId,
    String itemName,
    Integer quantity,
    Integer delivered,
    BigDecimal unitPrice
) {

  public ResponseGood(Good good) {
    this(good.getGoodId().getItem().getUuid(),
        good.getGoodId().getItem().getItemName(),
        good.getQuantity(),
        good.getDelivered(),
        good.getUnitPrice()
    );
  }
}
