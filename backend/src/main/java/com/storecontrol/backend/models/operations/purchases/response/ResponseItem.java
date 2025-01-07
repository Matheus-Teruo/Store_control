package com.storecontrol.backend.models.operations.purchases.response;

import com.storecontrol.backend.models.operations.purchases.Item;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseItem(
    UUID productUuid,
    String productName,
    Integer quantity,
    Integer delivered,
    BigDecimal unitPrice,
    BigDecimal discount
) {

  public ResponseItem(Item item) {
    this(item.getItemId().getProduct().getUuid(),
        item.getItemId().getProduct().getProductName(),
        item.getQuantity(),
        item.getDelivered(),
        item.getUnitPrice(),
        item.getDiscount()
    );
  }
}
