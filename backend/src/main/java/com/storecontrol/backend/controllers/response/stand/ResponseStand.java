package com.storecontrol.backend.controllers.response.stand;

import com.storecontrol.backend.controllers.response.association.ResponseAssociation;
import com.storecontrol.backend.models.Stand;

import java.util.UUID;

public record ResponseStand(
    UUID uuid,
    String stand,
    ResponseAssociation association
) {

  public ResponseStand(Stand stand) {
    this(stand.getUuid(),
        stand.getStandName(),
        new ResponseAssociation(stand.getAssociation())
    );
  }
}
