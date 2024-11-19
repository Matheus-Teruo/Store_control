package com.storecontrol.backend.controllers.customers.response;

import com.storecontrol.backend.models.customers.OrderCard;

import java.math.BigDecimal;

public record ResponseSummaryOrderCard(
    String id,
    BigDecimal debit
) {

  public ResponseSummaryOrderCard(OrderCard orderCard) {
    this(orderCard.getId(),
        orderCard.getDebit()
    );
  }
}
