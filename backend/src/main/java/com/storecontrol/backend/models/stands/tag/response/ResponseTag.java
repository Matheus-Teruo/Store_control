package com.storecontrol.backend.models.stands.tag.response;

import com.storecontrol.backend.models.stands.tag.Tag;

import java.util.UUID;

public record ResponseTag(
    UUID uuid,
    String tagName,
    String color
) {

  public ResponseTag(Tag tag) {
    this(tag.getUuid(),
        tag.getTagName(),
        tag.getColor()
    );
  }
}
