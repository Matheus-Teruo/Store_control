package com.storecontrol.backend.models.statistics.stands.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ResponsePurchaseChartNode(
    LocalDateTime time,
    Integer quantity,
    BigDecimal total
) {
}
