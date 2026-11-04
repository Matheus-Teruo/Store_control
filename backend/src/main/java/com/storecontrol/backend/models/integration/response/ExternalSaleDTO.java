package com.storecontrol.backend.models.integration.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record ExternalSaleDTO(
    String id,

    @JsonProperty("reference_id")
    String referenceId,

    @JsonProperty("created_at")
    OffsetDateTime createdAt,

    List<ItemDTO> items,

    CustomerDTO customer
) {
    public record ItemDTO(
        @JsonProperty("reference_id")
        String externalProductId,

        String name,

        Integer quantity,

        @JsonProperty("unit_amount")
        BigDecimal unitAmount,

        Integer weight
    ) {}

    public record CustomerDTO(
        String name,
        String email,

        @JsonProperty("tax_id")
        String taxId
    ) {}
}
