package com.storecontrol.backend.models.statistics.stands.response;

import java.util.List;
import java.util.UUID;

public record ResponseStandChart(
    UUID standUuid,
    String standName,
    List<ResponseProductChart> productCharts
) {
}
