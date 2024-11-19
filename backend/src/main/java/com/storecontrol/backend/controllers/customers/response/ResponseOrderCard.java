package com.storecontrol.backend.controllers.customers.response;

import com.storecontrol.backend.models.customers.OrderCard;

import java.math.BigDecimal;

public record ResponseOrderCard(
    String id,
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
