package com.storecontrol.backend.models.operations.purchases.response;

import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryPurchase(
    UUID uuid,
    Boolean onOrder,
    String purchaseTimeStamp,
    Integer totalItems,
    BigDecimal totalPurchaseCost,
    BigDecimal totalPurchaseDiscount,
    BigDecimal finalTotalPurchase,
    UUID voluntaryUuid
) {

  public ResponseSummaryPurchase(Purchase purchase) {
    this(
        purchase.getUuid(),
        purchase.isOnOrder(),
        purchase.getPurchaseTimeStamp().toString(),
        purchase.getItems().stream().map(Item::getQuantity)
            .reduce(0, Integer::sum),
        purchase.getItems().stream()
            .map(item -> BigDecimal.valueOf(item.getQuantity())
                .multiply(item.getUnitPrice()))
            .reduce(BigDecimal.ZERO, BigDecimal::add),
        purchase.getItems().stream()
            .map(item -> BigDecimal.valueOf(item.getQuantity())
                .multiply(item.getDiscount()))
            .reduce(BigDecimal.ZERO, BigDecimal::add),
        purchase.getItems().stream()
            .map(item -> BigDecimal.valueOf(item.getQuantity())
                .multiply(item.getUnitPrice().subtract(item.getDiscount())))
            .reduce(BigDecimal.ZERO, BigDecimal::add),
        purchase.getVoluntaryUuid()
    );
  }
}
