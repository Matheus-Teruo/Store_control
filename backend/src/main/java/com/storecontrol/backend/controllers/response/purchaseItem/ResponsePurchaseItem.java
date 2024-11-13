package com.storecontrol.backend.controllers.response.purchaseItem;

import com.storecontrol.backend.models.PurchaseItem;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponsePurchaseItem(
    UUID itemId,
    String itemName,
    Integer quantity,
    Integer delivered,
    BigDecimal unitPrice
) {

  public ResponsePurchaseItem(PurchaseItem purchaseItem) {
    this(purchaseItem.getPurchaseItemId().getItem().getUuid(),
        purchaseItem.getPurchaseItemId().getItem().getItemName(),
        purchaseItem.getQuantity(),
        purchaseItem.getDelivered(),
        purchaseItem.getUnitPrice()
    );
  }
}
