package com.storecontrol.backend.models.stands.products;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductComboId {

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "combo_product_uuid")
  private Product comboProduct;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "included_product_uuid")
  private Product includedProduct;
}
