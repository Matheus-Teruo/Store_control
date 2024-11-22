package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record RequestTransaction(
    @NotBlank
    String amount,
    @NotBlank
    String transactionTypeEnum,
    @NotBlank
    String cashRegisterId,
    @NotBlank
    UUID voluntaryId
) {
}
