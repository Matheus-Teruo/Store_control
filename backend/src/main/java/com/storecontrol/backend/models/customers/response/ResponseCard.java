package com.storecontrol.backend.models.customers.response;

import com.storecontrol.backend.models.customers.Card;

import java.math.BigDecimal;

public record ResponseCard(
    String cardId,
    BigDecimal debit,
    Boolean active
) {

  public ResponseCard(Card card) {
    this(card.getId(),
        card.getDebit(),
        card.isActive()
    );
  }
}
