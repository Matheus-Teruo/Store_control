package com.storecontrol.backend.models.volunteers.response;

import com.storecontrol.backend.models.volunteers.Voluntary;

import java.util.UUID;

public record ResponseSummaryVoluntary(
    UUID uuid,
    String username,
    String fullname,
    ResponseSummaryFunction SummaryStand
) {

  public ResponseSummaryVoluntary(Voluntary voluntary) {
    this(voluntary.getUuid(),
        voluntary.getUser().getUsername(),
        voluntary.getFullname(),
        voluntary.getFunction() != null ? new ResponseSummaryFunction(voluntary.getFunction()) : null);
  }
}
