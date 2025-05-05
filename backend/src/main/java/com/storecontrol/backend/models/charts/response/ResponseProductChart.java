package com.storecontrol.backend.models.charts.response;

import java.util.List;
import java.util.UUID;

public record ResponseProductChart(
    UUID productUuid,
    String productName,
    List<ResponsePurchaseChartNode> purchaseChartNodes
) {
}
