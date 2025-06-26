package com.storecontrol.backend.models.stands.products.response;

import com.storecontrol.backend.models.stands.products.ProductCombo;

import java.util.UUID;

public record ResponseProductCombo(
    UUID productIncludedUuid,
    Integer quantity
) {

  public ResponseProductCombo(ProductCombo productCombo) {
    this(productCombo.getProductIncludedUuid(),
        productCombo.getQuantity()
    );
  }
}
