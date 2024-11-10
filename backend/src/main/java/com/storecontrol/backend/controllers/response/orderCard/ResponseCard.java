package com.storecontrol.backend.controllers.response.orderCard;

import com.storecontrol.backend.models.OrderCard;

import java.math.BigDecimal;

public record ResponseCard(
    String id,
    BigDecimal debit
) {

  public ResponseCard(OrderCard orderCard) {
    this(orderCard.getId(),
        orderCard.getDebit());
  }
}
