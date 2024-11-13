package com.storecontrol.backend.controllers.response.voluntary;

import com.storecontrol.backend.controllers.response.stand.ResponseStand;
import com.storecontrol.backend.models.Voluntary;

import java.util.UUID;

public record ResponseVoluntary(
    UUID uuid,
    String username,
    String fullname,
    ResponseStand Stand,
    Boolean superuser
) {

  public ResponseVoluntary(Voluntary voluntary) {
    this(voluntary.getUuid(),
        voluntary.getUser().getUsername(),
        voluntary.getFullname(),
        voluntary.getStand() != null ? new ResponseStand(voluntary.getStand()) : null,
        voluntary.getSuperuser()
    );
  }
}
