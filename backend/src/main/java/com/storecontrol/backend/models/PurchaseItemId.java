package com.storecontrol.backend.models;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
public class PurchaseItemId {
  @ManyToOne @JoinColumn(name = "purchase_uuid")
  private Purchase purchase;
  @ManyToOne @JoinColumn(name = "product_uuid")
  private Product product;

  public PurchaseItemId(Product product, Purchase purchase) {
    this.product = product;
    this.purchase = purchase;
  }
}
