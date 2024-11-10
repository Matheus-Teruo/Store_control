package com.storecontrol.backend.controllers.response.association;

import com.storecontrol.backend.models.Association;
import com.storecontrol.backend.models.Voluntary;

public record ResponseAssociation(
    String uuid,
    String association,
    String principalName,
    Voluntary principal
) {

  public ResponseAssociation(Association association) {
    this(association.getUuid().toString(),
        association.getAssociation(),
        association.getPrincipalName(),
        association.getPrincipal());
  }
}
