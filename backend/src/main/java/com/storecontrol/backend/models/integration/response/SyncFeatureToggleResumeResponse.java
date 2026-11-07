package com.storecontrol.backend.models.integration.response;

import com.storecontrol.backend.models.integration.SyncFeatureToggle;

import java.util.UUID;

public record SyncFeatureToggleResumeResponse(
    UUID id,
    String featureName
) {
    public SyncFeatureToggleResumeResponse(SyncFeatureToggle syncFeatureToggle) {
        this(
            syncFeatureToggle.getId(),
            syncFeatureToggle.getFeatureName()
        );
    }
}
