package com.storecontrol.backend.models.volunteers.response;

import com.storecontrol.backend.models.volunteers.Voluntary;

import java.util.UUID;

public record ResponseSummaryVoluntary(
    UUID uuid,
    String fullname,
    ResponseSummaryFunction summaryFunction,
    String voluntaryRole
) {

  public ResponseSummaryVoluntary(Voluntary voluntary) {
    this(voluntary.getUuid(),
        voluntary.getFullname(),
        voluntary.getFunction() != null ? new ResponseSummaryFunction(voluntary.getFunction()) : null,
        voluntary.getVoluntaryRole().toString()
    );
  }
}
