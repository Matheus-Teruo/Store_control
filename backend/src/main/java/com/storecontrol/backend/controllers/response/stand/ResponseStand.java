package com.storecontrol.backend.controllers.response.stand;

import com.storecontrol.backend.models.Association;
import com.storecontrol.backend.models.Stand;

public record ResponseStand(
    String uuid,
    String stand,
    Association association
) {

  public ResponseStand(Stand stand) {
    this(stand.getUuid().toString(),
        stand.getStand(),
        stand.getAssociation());
  }
}
