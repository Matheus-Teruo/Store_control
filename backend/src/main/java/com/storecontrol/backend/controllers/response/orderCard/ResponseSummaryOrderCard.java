package com.storecontrol.backend.controllers.response.orderCard;

import com.storecontrol.backend.models.OrderCard;

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
