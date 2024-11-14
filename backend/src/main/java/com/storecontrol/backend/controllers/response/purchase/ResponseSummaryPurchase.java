package com.storecontrol.backend.controllers.response.purchase;

import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.Purchase;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ResponseSummaryPurchase(
    UUID uuid,
    Boolean onOrder,
    LocalDateTime saleTimeStamp,
    Integer totalItems,
    BigDecimal totalPurchaseCost,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponseSummaryPurchase(Purchase purchase) {
    this(
        purchase.getUuid(),
        purchase.getOnOrder(),
        purchase.getPurchaseTimeStamp(),
        purchase.getItems().size(),
        purchase.getItems().stream()
            .map(item -> BigDecimal.valueOf(item.getQuantity())
                .multiply(item.getUnitPrice()))
            .reduce(BigDecimal.ZERO, BigDecimal::add),
        new ResponseSummaryCustomer(purchase.getCustomer()),
        new ResponseSummaryVoluntary(purchase.getVoluntary())
    );
  }
}
