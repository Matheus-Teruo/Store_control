package com.storecontrol.backend.models;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Embeddable
public class GoodID {
  @ManyToOne @JoinColumn(name = "item_id")
  private Item item;
  @ManyToOne @JoinColumn(name = "sale_id")
  private Sale sale;
}
