package com.storecontrol.backend.controllers.response.item;

import com.storecontrol.backend.models.Item;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseItem(
    UUID itemId,
    String productName,
    Integer quantity,
    Integer delivered,
    BigDecimal unitPrice
) {

  public ResponseItem(Item item) {
    this(item.getItemId().getProduct().getUuid(),
        item.getItemId().getProduct().getProductName(),
        item.getQuantity(),
        item.getDelivered(),
        item.getUnitPrice()
    );
  }
}
