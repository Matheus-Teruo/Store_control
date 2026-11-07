package com.storecontrol.backend.models.integration.request;

public record CreateSyncFeatureToggleRequest(
    String featureName,

    String origin
) {
}
