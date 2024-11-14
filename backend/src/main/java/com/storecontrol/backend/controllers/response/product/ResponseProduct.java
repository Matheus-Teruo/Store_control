package com.storecontrol.backend.controllers.response.product;

import com.storecontrol.backend.controllers.response.stand.ResponseStand;
import com.storecontrol.backend.models.Product;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseProduct(
    UUID uuid,
    String productName,
    BigDecimal price,
    Integer stock,
    String productImg,
    ResponseStand stand
) {

  public ResponseProduct(Product product) {
    this(product.getUuid(),
        product.getProductName(),
        product.getPrice(),
        product.getStock(),
        product.getProductImg(),
        new ResponseStand(product.getStand())
    );
  }
}
