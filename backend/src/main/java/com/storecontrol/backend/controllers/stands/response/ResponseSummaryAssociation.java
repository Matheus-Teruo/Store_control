package com.storecontrol.backend.controllers.stands.response;

import com.storecontrol.backend.models.stands.Association;

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
