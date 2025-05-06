package com.storecontrol.backend.models.statistics.stands.response;

import java.util.List;
import java.util.UUID;

public record ResponseStandProductTotal(
    UUID standUuid,
    String standName,
    List<ResponseProductTotal> productTotal
) {
}
