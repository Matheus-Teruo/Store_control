package com.storecontrol.backend.controllers.response.voluntary;

import com.storecontrol.backend.controllers.response.stand.ResponseSummaryStand;
import com.storecontrol.backend.models.Voluntary;

import java.util.UUID;

public record ResponseSummaryVoluntary(
    UUID uuid,
    String username,
    String fullname,
    ResponseSummaryStand SummaryStand
) {

  public ResponseSummaryVoluntary(Voluntary voluntary) {
    this(voluntary.getUuid(),
        voluntary.getUser().getUsername(),
        voluntary.getFullname(),
        voluntary.getStand() != null ? new ResponseSummaryStand(voluntary.getStand()) : null);
  }
}
