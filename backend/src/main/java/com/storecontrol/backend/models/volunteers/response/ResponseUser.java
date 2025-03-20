package com.storecontrol.backend.models.volunteers.response;

import com.storecontrol.backend.models.volunteers.Voluntary;

import java.util.UUID;

public record ResponseUser(
    UUID uuid,
    String firstname,
    ResponseSummaryFunction summaryFunction,
    String voluntaryRole
) {

  public ResponseUser(Voluntary voluntary) {
    this(voluntary.getUuid(),
        voluntary.getFullname().split(" ")[0],
        voluntary.getFunction() != null ? new ResponseSummaryFunction(voluntary.getFunction()) : null,
        voluntary.getVoluntaryRole().toString());
  }
}
