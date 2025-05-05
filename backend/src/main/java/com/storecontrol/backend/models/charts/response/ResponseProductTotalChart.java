package com.storecontrol.backend.models.charts.response;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseProductTotalChart(
    UUID productUuid,
    String productName,
    Integer totalProductQuantity,
    BigDecimal totalAmount
) {
}
