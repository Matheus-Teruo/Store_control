package com.storecontrol.backend.models.stands.products;

import com.storecontrol.backend.models.stands.products.request.RequestCreateProductCombo;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "product_combos")
@Getter
@NoArgsConstructor
public class ProductCombo {

  @EmbeddedId
  private ProductComboId productComboId;

  @Column(name = "included_product_uuid", insertable = false, updatable = false)
  private UUID includedProductUuid;

  @Setter
  @Column(nullable = false)
  private Integer quantity;

  public ProductCombo(RequestCreateProductCombo request, ProductComboId comboId) {
    this.productComboId = comboId;
    this.quantity = request.quantity();
  }
}
