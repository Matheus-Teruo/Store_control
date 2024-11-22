package com.storecontrol.backend.models.operations.purchases.response;

import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.operations.purchases.Purchase;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryPurchase(
    UUID uuid,
    Boolean onOrder,
    String saleTimeStamp,
    Integer totalItems,
    BigDecimal totalPurchaseCost,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseSummaryPurchase(Purchase purchase) {
    this(
        purchase.getUuid(),
        purchase.isOnOrder(),
        purchase.getPurchaseTimeStamp().toString(),
        purchase.getItems().size(),
        purchase.getItems().stream()
            .map(item -> BigDecimal.valueOf(item.getQuantity())
                .multiply(item.getUnitPrice()))
            .reduce(BigDecimal.ZERO, BigDecimal::add),
        new ResponseSummaryVoluntary(purchase.getVoluntary())
    );
  }
}
