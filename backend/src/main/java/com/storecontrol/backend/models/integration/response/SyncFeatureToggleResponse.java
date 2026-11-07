package com.storecontrol.backend.models.integration.response;

import java.util.UUID;

import com.storecontrol.backend.models.integration.SyncFeatureToggle;

public record SyncFeatureToggleResponse(
    UUID id,
    String featureName,
    String origin
    // UUID eventLinked
) {
    public SyncFeatureToggleResponse(SyncFeatureToggle syncFeatureToggle) {
        this(
            syncFeatureToggle.getId(),
            syncFeatureToggle.getFeatureName(),
            syncFeatureToggle.getOrigin()
            // syncFeatureToggle.getEventLinked()
        );
    }
}
