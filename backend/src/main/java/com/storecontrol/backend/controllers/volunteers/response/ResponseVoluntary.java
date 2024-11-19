package com.storecontrol.backend.controllers.volunteers.response;

import com.storecontrol.backend.models.volunteers.Voluntary;

import java.util.UUID;

public record ResponseVoluntary(
    UUID uuid,
    String username,
    String fullname,
    ResponseFunction function,
    Boolean superuser
) {

  public ResponseVoluntary(Voluntary voluntary) {
    this(voluntary.getUuid(),
        voluntary.getUser().getUsername(),
        voluntary.getFullname(),
        voluntary.getFunction() != null ? new ResponseFunction(voluntary.getFunction()) : null,
        voluntary.isSuperuser()
    );
  }
}
