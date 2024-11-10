package com.storecontrol.backend.controllers.response.item;

import com.storecontrol.backend.models.Item;
import com.storecontrol.backend.models.Stand;

import java.math.BigDecimal;

public record ResponseItem(
    String uuid,
    String itemName,
    BigDecimal price,
    Integer stock,
    String itemImg,
    Stand stand
) {

  public ResponseItem(Item item) {
    this(item.getUuid().toString(),
        item.getItemName(),
        item.getPrice(),
        item.getStock(),
        item.getItemImg(),
        item.getStand());
  }
}
