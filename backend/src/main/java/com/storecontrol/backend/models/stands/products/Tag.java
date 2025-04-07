package com.storecontrol.backend.models.stands.products;

import com.storecontrol.backend.models.stands.products.request.RequestCreateTag;
import com.storecontrol.backend.models.stands.products.request.RequestUpdateProduct;
import com.storecontrol.backend.models.stands.products.request.RequestUpdateTag;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tags")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Tag {

  @Id
  @GeneratedValue(generator = "UUID")
  private UUID uuid;

  @Column(name = "tag_name", nullable = false)
  private String tagName;

  private String color;

  @OneToMany(mappedBy = "tagProductId.tag")
  private List<TagProduct> tagProducts;


  public Tag(RequestCreateTag request){
    this.tagName = request.tagName();
    this.color = request.color();
  }

  public void updateTag(RequestUpdateTag request) {
    if (request.tagName() != null) {
      this.tagName = request.tagName();
    }
    if (request.color() != null) {
      this.color = request.color();
    }
  }
}
