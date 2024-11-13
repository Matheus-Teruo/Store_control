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
  @ManyToOne @JoinColumn(name = "item_uuid")
  private Item item;

  public PurchaseItemId(Item item, Purchase purchase) {
    this.item = item;
    this.purchase = purchase;
  }
}
