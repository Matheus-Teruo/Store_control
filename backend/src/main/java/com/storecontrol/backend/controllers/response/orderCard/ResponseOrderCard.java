package com.storecontrol.backend.controllers.response.orderCard;

import com.storecontrol.backend.models.OrderCard;

import java.math.BigDecimal;

public record ResponseOrderCard(
    String id,
    BigDecimal debit,
    Boolean active
) {

  public ResponseOrderCard(OrderCard orderCard) {
    this(orderCard.getId(),
        orderCard.getDebit(),
        orderCard.getActive()
    );
  }
}
