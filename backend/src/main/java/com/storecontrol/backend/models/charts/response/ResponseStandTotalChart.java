package com.storecontrol.backend.models.charts.response;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseStandTotalChart(
    UUID standUuid,
    String standName,
    Integer totalProductQuantity,
    BigDecimal totalAmount
) {
}
