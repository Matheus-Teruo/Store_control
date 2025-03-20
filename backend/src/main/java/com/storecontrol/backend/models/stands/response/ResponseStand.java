package com.storecontrol.backend.models.stands.response;

import com.storecontrol.backend.models.stands.Stand;

import java.util.UUID;

public record ResponseStand(
    UUID uuid,
    String standName,
    ResponseAssociation association
) {

  public ResponseStand(Stand stand) {
    this(stand.getUuid(),
        stand.getFunctionName(),
        new ResponseAssociation(stand.getAssociation())
    );
  }
}
