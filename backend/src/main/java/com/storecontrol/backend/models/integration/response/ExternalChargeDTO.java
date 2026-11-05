package com.storecontrol.backend.models.integration.response;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

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
) {

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
        String type,
        Integer installments,
        Boolean capture,
        CardDTO card
    ) {}

    public record CardDTO(
        String brand,

        @JsonProperty("first_digits")
        String firstDigits,

        @JsonProperty("last_digits")
        String lastDigits,

        @JsonProperty("exp_month")
        String expMonth,

        @JsonProperty("exp_year")
        String expYear,

        HolderDTO holder
    ) {}

    public record HolderDTO(
        String name
    ) {}
}