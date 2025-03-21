package com.storecontrol.backend.models.stands.response;

import com.storecontrol.backend.models.stands.Association;

import java.util.UUID;

public record ResponseSummaryAssociation(
    UUID uuid,
    String associationName,
    String associationKey
) {

  public ResponseSummaryAssociation(Association association) {
    this(association.getUuid(),
        association.getAssociationName(),
        association.getAssociationKey()
    );
  }
}
