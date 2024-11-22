package com.storecontrol.backend.models.volunteers.response;

import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.volunteers.Function;

import java.util.UUID;

public record ResponseSummaryFunction(
    UUID uuid,
    String functionName,
    String typeOfFunction
) {

  public ResponseSummaryFunction(Function function) {
    this(function.getUuid(),
        function.getFunctionName(),
        function instanceof Stand ? "Stand" : "Register"
    );
  }
}
