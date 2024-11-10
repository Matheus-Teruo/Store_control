package com.storecontrol.backend.controllers.response.stand;

import com.storecontrol.backend.models.Stand;

public record ResponseSummaryStand(
    String uuid,
    String stand
) {

  public ResponseSummaryStand(Stand stand) {
    this(stand.getUuid().toString(),
        stand.getStand());
  }
}
