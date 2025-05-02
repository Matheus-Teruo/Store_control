package com.storecontrol.backend.models.stands.products.response;

import com.storecontrol.backend.models.operations.purchases.response.ResponsePurchaseChartNode;

import java.util.List;
import java.util.UUID;

public record ResponseProductChart(
    UUID productUuid,
    String productName,
    List<ResponsePurchaseChartNode> purchaseChartNodes
) {
}
