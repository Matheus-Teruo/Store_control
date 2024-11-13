package com.storecontrol.backend.controllers.response.item;

import com.storecontrol.backend.controllers.response.stand.ResponseStand;
import com.storecontrol.backend.models.Item;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseItem(
    UUID uuid,
    String itemName,
    BigDecimal price,
    Integer stock,
    String itemImg,
    ResponseStand stand
) {

  public ResponseItem(Item item) {
    this(item.getUuid(),
        item.getItemName(),
        item.getPrice(),
        item.getStock(),
        item.getItemImg(),
        new ResponseStand(item.getStand())
    );
  }
}
