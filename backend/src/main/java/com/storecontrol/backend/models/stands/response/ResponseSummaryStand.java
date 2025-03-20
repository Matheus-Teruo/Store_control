package com.storecontrol.backend.models.stands.response;

import com.storecontrol.backend.models.stands.Stand;

import java.util.UUID;

public record ResponseSummaryStand(
    UUID uuid,
    String standName,
    UUID associationUuid
) {

  public ResponseSummaryStand(Stand stand) {
    this(stand.getUuid(),
        stand.getFunctionName(),
        stand.getAssociationUuid()
    );
  }
}
