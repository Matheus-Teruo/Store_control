package com.storecontrol.backend.models.operations.purchases.response;

import com.storecontrol.backend.models.operations.purchases.Purchase;

import java.util.List;
import java.util.UUID;

public record ResponsePurchaseCard(
    UUID uuid,
    Boolean onOrder,
    Boolean reversal,
    UUID standUuid,
    String purchaseTimestamp,
    List<ResponseItem> items
) {

  public ResponsePurchaseCard(Purchase purchase) {
    this(
        purchase.getUuid(),
        purchase.isOnOrder(),
        purchase.isReversal(),
        purchase.getStandUuid(),
        purchase.getPurchaseTimestamp().toString(),
        purchase.getItems().stream().map(ResponseItem::new).toList()
    );
  }
}
