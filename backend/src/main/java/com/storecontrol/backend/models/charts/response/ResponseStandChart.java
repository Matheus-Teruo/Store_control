package com.storecontrol.backend.models.charts.response;

import java.util.List;
import java.util.UUID;

public record ResponseStandChart(
    UUID standUuid,
    String standName,
    List<ResponseProductChart> productCharts
) {
}
