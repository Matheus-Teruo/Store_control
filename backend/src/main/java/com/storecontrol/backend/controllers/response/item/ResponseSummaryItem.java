package com.storecontrol.backend.controllers.response.item;

import com.storecontrol.backend.controllers.response.stand.ResponseSummaryStand;
import com.storecontrol.backend.models.Item;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryItem(
    UUID uuid,
    String itemName,
    BigDecimal price,
    Integer stock,
    String itemImg,
    ResponseSummaryStand summaryStand
) {

  public ResponseSummaryItem(Item item) {
    this(item.getUuid(),
        item.getItemName(),
        item.getPrice(),
        item.getStock(),
        item.getItemImg(),
        new ResponseSummaryStand(item.getStand())
    );
  }
}
