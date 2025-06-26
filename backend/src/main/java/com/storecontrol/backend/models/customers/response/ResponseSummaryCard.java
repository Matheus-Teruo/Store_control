package com.storecontrol.backend.models.customers.response;

import com.storecontrol.backend.models.customers.Card;

import java.math.BigDecimal;

public record ResponseSummaryCard(
    String cardId,
    BigDecimal debit
) {

  public ResponseSummaryCard(Card card) {
    this(card.getId(),
        card.getDebit()
    );
  }
}
