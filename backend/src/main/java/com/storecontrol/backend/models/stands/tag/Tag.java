package com.storecontrol.backend.models.stands.tag;

import com.storecontrol.backend.models.stands.tag.request.RequestCreateTag;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

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


  public Tag(RequestCreateTag request){
    this.tagName = request.tagName();
    this.color = request.color();
  }
}
