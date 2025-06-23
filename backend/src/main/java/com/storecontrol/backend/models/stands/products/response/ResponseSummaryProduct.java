package com.storecontrol.backend.models.stands.products.response;

import com.storecontrol.backend.models.stands.products.Product;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseSummaryProduct(
    UUID uuid,
    String productName,
    String summary,
    boolean description,
    boolean combo,
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
        product.getDescription() != null,
        product.isCombo(),
        product.getPrice(),
        product.getDiscount(),
        product.getStock(),
        product.getProductImg(),
        product.getStandUuid()
    );
  }
}
