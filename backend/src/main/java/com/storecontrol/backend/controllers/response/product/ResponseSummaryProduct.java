package com.storecontrol.backend.controllers.response.product;

import com.storecontrol.backend.controllers.response.stand.ResponseSummaryStand;
import com.storecontrol.backend.models.Product;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryProduct(
    UUID uuid,
    String productName,
    BigDecimal price,
    Integer stock,
    String productImg,
    ResponseSummaryStand summaryStand
) {

  public ResponseSummaryProduct(Product product) {
    this(product.getUuid(),
        product.getProductName(),
        product.getPrice(),
        product.getStock(),
        product.getProductImg(),
        new ResponseSummaryStand(product.getStand())
    );
  }
}
