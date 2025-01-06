package com.storecontrol.backend.models.customers.response;

import com.storecontrol.backend.models.customers.OrderCard;

import java.math.BigDecimal;

public record ResponseSummaryOrderCard(
    String cardId,
    BigDecimal debit
) {

  public ResponseSummaryOrderCard(OrderCard orderCard) {
    this(orderCard.getId(),
        orderCard.getDebit()
    );
  }
}
