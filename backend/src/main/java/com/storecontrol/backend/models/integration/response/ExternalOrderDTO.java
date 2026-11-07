package com.storecontrol.backend.models.integration.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record ExternalOrderDTO(
    String id,

    @JsonProperty("reference_id")
    String referenceId,

    @JsonProperty("created_at")
    OffsetDateTime createdAt,

    List<ItemDTO> items,

    List<ExternalChargeDTO> charges,

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

    public record ExternalChargeDTO(
        String id,

        @JsonProperty ("reference_id")
        String referenceId,

        String status,

        @JsonProperty("created_at")
        OffsetDateTime createdAt,

        String description,

        AmountDTO amount,

        @JsonProperty("payment_response")
        PaymentResponseDTO paymentResponse,

        @JsonProperty("payment_method")
        PaymentMethodDTO paymentMethod
    ) {}

    public record AmountDTO(
        Integer value,
        String currency,
        SummaryDTO summary
    ) {}

    public record SummaryDTO(
        Integer total,
        Integer paid,
        Integer refunded
    ) {}

    public record PaymentResponseDTO(
        Integer code,
        String message,
        String reference
    ) {}

    public record PaymentMethodDTO(
        String type
    ) {}

    public record HolderDTO(
        String name
    ) {}
}
