package com.storecontrol.backend.controllers.response.voluntary;

import com.storecontrol.backend.models.Voluntary;

public record ResponseSummaryVoluntary(
    String uuid,
    String username,
    String fullname
) {

  public ResponseSummaryVoluntary(Voluntary voluntary) {
    this(voluntary.getUuid().toString(),
        voluntary.getUser().getUsername(),
        voluntary.getFullname());
  }
}
