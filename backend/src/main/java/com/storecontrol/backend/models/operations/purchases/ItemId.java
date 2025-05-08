package com.storecontrol.backend.models.operations.purchases;

import com.storecontrol.backend.models.stands.products.Product;
import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
public class ItemId{

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "purchase_uuid")
  private Purchase purchase;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_uuid")
  private Product product;


  public ItemId(Product product, Purchase purchase) {
    this.product = product;
    this.purchase = purchase;
  }
}
