package com.storecontrol.backend.models.stands.response;

import com.storecontrol.backend.models.stands.Product;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryProduct(
    UUID uuid,
    String productName,
    BigDecimal price,
    Integer stock,
    String productImg,
    UUID standUuid
) {

  public ResponseSummaryProduct(Product product) {
    this(product.getUuid(),
        product.getProductName(),
        product.getPrice(),
        product.getStock(),
        product.getProductImg(),
        product.getStandUuid()
    );
  }
}
