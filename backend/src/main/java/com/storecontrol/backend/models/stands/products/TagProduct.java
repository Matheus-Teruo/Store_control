package com.storecontrol.backend.models.stands.products;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tag_product")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TagProduct {

  @EmbeddedId
  private TagProductId tagProductId;

  public TagProduct(Tag tag, Product product) {
    this.tagProductId = new TagProductId(tag, product);
  }
}
