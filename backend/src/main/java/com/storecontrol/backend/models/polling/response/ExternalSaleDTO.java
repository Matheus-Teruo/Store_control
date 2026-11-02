package com.storecontrol.backend.models.polling.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ExternalSaleDTO(
    String id,
    BigDecimal totalAmount,
    LocalDateTime createdAt,
    String paymentMethod,
    List<ItemDTO> items
) {
    public record ItemDTO(
        String externalProductId,
        String name,
        Integer quantity,
        BigDecimal unitAmount
    ) {}
}