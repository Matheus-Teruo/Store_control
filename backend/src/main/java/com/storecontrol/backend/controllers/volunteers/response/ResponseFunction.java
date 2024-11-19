package com.storecontrol.backend.controllers.volunteers.response;

import com.storecontrol.backend.models.volunteers.Function;

import java.util.UUID;

public record ResponseFunction(
    UUID uuid,
    String stand
) {

  public ResponseFunction(Function function) {
    this(function.getUuid(),
        function.getFunctionName()
    );
  }
}
