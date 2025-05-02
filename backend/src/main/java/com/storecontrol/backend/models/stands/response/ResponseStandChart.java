package com.storecontrol.backend.models.stands.response;

import com.storecontrol.backend.models.stands.products.response.ResponseProductChart;

import java.util.List;
import java.util.UUID;

public record ResponseStandChart(
    UUID standUuid,
    String standName,
    List<ResponseProductChart> productCharts
) {
}
