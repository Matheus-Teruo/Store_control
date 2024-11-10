package com.storecontrol.backend.controllers.response.voluntary;

import com.storecontrol.backend.models.Voluntary;

public record ResponseVoluntary(
    String uuid,
    String username,
    String password,
    String salt,
    String fullname
) {

  public ResponseVoluntary(Voluntary voluntary) {
    this(voluntary.getUuid().toString(),
        voluntary.getUser().getUsername(),
        voluntary.getUser().getPassword(),
        voluntary.getUser().getSalt(),
        voluntary.getFullname());
  }
}
