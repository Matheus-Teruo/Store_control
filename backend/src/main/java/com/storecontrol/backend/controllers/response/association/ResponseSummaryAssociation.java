package com.storecontrol.backend.controllers.response.association;

import com.storecontrol.backend.models.Association;

import java.util.UUID;

public record ResponseSummaryAssociation(
    UUID uuid,
    String association
) {

  public ResponseSummaryAssociation(Association association) {
    this(association.getUuid(),
        association.getAssociationName()
    );
  }
}
