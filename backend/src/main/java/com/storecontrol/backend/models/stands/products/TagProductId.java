package com.storecontrol.backend.models.stands.products;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
public class TagProductId {

  @ManyToOne @JoinColumn(name = "tag_uuid")
  private Tag tag;

  @ManyToOne @JoinColumn(name = "product_uuid")
  private Product product;


  public TagProductId(Tag tag, Product product) {
    this.tag = tag;
    this.product = product;
  }
}
