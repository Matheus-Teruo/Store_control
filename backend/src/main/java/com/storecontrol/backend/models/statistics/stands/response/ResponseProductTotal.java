package com.storecontrol.backend.models.statistics.stands.response;

import java.math.BigDecimal;
import java.util.UUID;

public record ResponseProductTotal(
    UUID productUuid,
    String productName,
    Integer totalProductQuantity,
    BigDecimal totalAmount
) {
}
