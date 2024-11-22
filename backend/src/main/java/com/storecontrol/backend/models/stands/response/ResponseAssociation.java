package com.storecontrol.backend.models.stands.response;

import com.storecontrol.backend.models.stands.Association;

import java.util.UUID;

public record ResponseAssociation(
    UUID uuid,
    String association,
    String principalName
) {

  public ResponseAssociation(Association association) {
    this(association.getUuid(),
        association.getAssociationName(),
        association.getPrincipalName()
    );
  }
}
