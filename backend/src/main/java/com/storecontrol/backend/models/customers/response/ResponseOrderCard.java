package com.storecontrol.backend.models.customers.response;

import com.storecontrol.backend.models.customers.OrderCard;

import java.math.BigDecimal;

public record ResponseOrderCard(
    String cardId,
    BigDecimal debit,
    Boolean active
) {

  public ResponseOrderCard(OrderCard orderCard) {
    this(orderCard.getId(),
        orderCard.getDebit(),
        orderCard.isActive()
    );
  }
}
