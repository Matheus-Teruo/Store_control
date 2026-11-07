package com.storecontrol.backend.models.integration.request;

import java.util.List;
import java.util.UUID;

public record SyncOrderRequest(
    UUID syncFeatureToggleUuid,

    List<String> orderCodes
) {
}
