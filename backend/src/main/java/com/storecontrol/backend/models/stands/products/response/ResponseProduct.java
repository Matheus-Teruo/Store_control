package com.storecontrol.backend.models.stands.products.response;

import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.response.ResponseStand;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ResponseProduct(
    UUID uuid,
    String productName,
    List<ResponseTag> tags,
    String summary,
    String description,
    BigDecimal price,
    BigDecimal discount,
    Integer stock,
    String productImg,
    ResponseStand stand
) {

  public ResponseProduct(Product product) {
    this(product.getUuid(),
        product.getProductName(),
        product.getTags()
            .stream()
            .map(ResponseTag::new).toList(),
        product.getSummary(),
        product.getDescription(),
        product.getPrice(),
        product.getDiscount(),
        product.getStock(),
        product.getProductImg(),
        new ResponseStand(product.getStand())
    );
  }
}
