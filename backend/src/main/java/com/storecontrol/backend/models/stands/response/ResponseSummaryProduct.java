package com.storecontrol.backend.models.stands.response;

import com.storecontrol.backend.models.stands.Product;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryProduct(
    UUID uuid,
    String productName,
    String summary,
    BigDecimal price,
    BigDecimal discount,
    Integer stock,
    String productImg,
    UUID standUuid
) {

  public ResponseSummaryProduct(Product product) {
    this(product.getUuid(),
        product.getProductName(),
        product.getSummary(),
        product.getPrice(),
        product.getDiscount(),
        product.getStock(),
        product.getProductImg(),
        product.getStandUuid()
    );
  }
}
