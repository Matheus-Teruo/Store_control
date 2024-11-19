package com.storecontrol.backend.controllers.stands.response;

import com.storecontrol.backend.models.stands.Stand;

import java.util.UUID;

public record ResponseSummaryStand(
    UUID uuid,
    String stand
) {

  public ResponseSummaryStand(Stand stand) {
    this(stand.getUuid(),
        stand.getFunctionName()
    );
  }
}
