package com.storecontrol.backend.models.stands.products.response;

import com.storecontrol.backend.models.stands.products.ProductCombo;

import java.util.UUID;

public record ResponseProductCombo(
    UUID includedProduct,
    Integer quantity
) {

  public ResponseProductCombo(ProductCombo productCombo) {
    this(productCombo.getIncludedProductUuid(),
        productCombo.getQuantity()
    );
  }
}
