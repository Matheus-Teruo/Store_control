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

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_combo_uuid")
  private Product productCombo;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_included_uuid")
  private Product productIncluded;
}
