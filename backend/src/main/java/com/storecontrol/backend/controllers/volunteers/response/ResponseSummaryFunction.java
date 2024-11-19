package com.storecontrol.backend.controllers.volunteers.response;

import com.storecontrol.backend.models.volunteers.Function;

import java.util.UUID;

public record ResponseSummaryFunction(
    UUID uuid,
    String stand
) {

  public ResponseSummaryFunction(Function function) {
    this(function.getUuid(),
        function.getFunctionName()
    );
  }
}
