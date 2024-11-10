package com.storecontrol.backend.controllers.response.association;

import com.storecontrol.backend.models.Association;

public record ResponseSummaryAssociation(
    String uuid,
    String association
) {

  public ResponseSummaryAssociation(Association association) {
    this(association.getUuid().toString(),
        association.getAssociation());
  }
}
