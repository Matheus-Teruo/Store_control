package com.storecontrol.backend.models.operations.purchases.response;

import com.storecontrol.backend.models.operations.purchases.Purchase;

import java.util.List;
import java.util.UUID;

public record ResponsePurchaseOrder(
    UUID uuid,
    Boolean onOrder,
    String purchaseTimeStamp,
    List<ResponseItem> items
) {

  public ResponsePurchaseOrder(Purchase purchase) {
    this(
        purchase.getUuid(),
        purchase.isOnOrder(),
        purchase.getPurchaseTimeStamp().toString(),
        purchase.getItems().stream().map(ResponseItem::new).toList()
    );
  }
}
