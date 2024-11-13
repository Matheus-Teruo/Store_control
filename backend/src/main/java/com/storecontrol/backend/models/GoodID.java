package com.storecontrol.backend.models;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
public class GoodID {
  @ManyToOne @JoinColumn(name = "item_uuid")
  private Item item;
  @ManyToOne @JoinColumn(name = "sale_uuid")
  private Purchase purchase;

  public GoodID(Item item, Purchase purchase) {
    this.item = item;
    this.purchase = purchase;
  }
}
