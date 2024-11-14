package com.storecontrol.backend.controllers.response.purchaseItem;

import com.storecontrol.backend.models.PurchaseItem;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponsePurchaseItem(
    UUID itemId,
    String productName,
    Integer quantity,
    Integer delivered,
    BigDecimal unitPrice
) {

  public ResponsePurchaseItem(PurchaseItem purchaseItem) {
    this(purchaseItem.getPurchaseItemId().getProduct().getUuid(),
        purchaseItem.getPurchaseItemId().getProduct().getProductName(),
        purchaseItem.getQuantity(),
        purchaseItem.getDelivered(),
        purchaseItem.getUnitPrice()
    );
  }
}
