package com.storecontrol.backend.models;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
public class ItemId {
  @ManyToOne @JoinColumn(name = "purchase_uuid")
  private Purchase purchase;
  @ManyToOne @JoinColumn(name = "product_uuid")
  private Product product;

  public ItemId(Product product, Purchase purchase) {
    this.product = product;
    this.purchase = purchase;
  }
}
