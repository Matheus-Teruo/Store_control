package com.storecontrol.backend.controllers.response.stand;

import com.storecontrol.backend.models.Stand;

import java.util.UUID;

public record ResponseSummaryStand(
    UUID uuid,
    String stand
) {

  public ResponseSummaryStand(Stand stand) {
    this(stand.getUuid(),
        stand.getStandName()
    );
  }
}
