package com.storecontrol.backend.models.volunteers.response;

import com.storecontrol.backend.models.enumerate.VoluntaryRole;
import com.storecontrol.backend.models.volunteers.Voluntary;

import java.util.UUID;

public record ResponseVoluntary(
    UUID uuid,
    String username,
    String fullname,
    ResponseSummaryFunction summaryFunction,
    VoluntaryRole voluntaryRole
) {

  public ResponseVoluntary(Voluntary voluntary) {
    this(voluntary.getUuid(),
        voluntary.getUser().getUsername(),
        voluntary.getFullname(),
        voluntary.getFunction() != null ? new ResponseSummaryFunction(voluntary.getFunction()) : null,
        voluntary.getVoluntaryRole()
    );
  }
}
