package com.storecontrol.backend.models.stands.response;

import com.storecontrol.backend.models.stands.Product;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseProduct(
    UUID uuid,
    String productName,
    BigDecimal price,
    BigDecimal discount,
    Integer stock,
    String productImg,
    ResponseStand stand
) {

  public ResponseProduct(Product product) {
    this(product.getUuid(),
        product.getProductName(),
        product.getPrice(),
        product.getDiscount(),
        product.getStock(),
        product.getProductImg(),
        new ResponseStand(product.getStand())
    );
  }
}
