package com.storecontrol.backend.models.charts.response;

import java.util.List;
import java.util.UUID;

public record ResponseStandProductTotalChart(
    UUID standUuid,
    String standName,
    List<ResponseProductTotalChart> productTotalCharts
) {
}
