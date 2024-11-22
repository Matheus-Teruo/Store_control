package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RequestTransaction(
    @NotBlank
    String amount,
    @NotBlank
    String transactionTypeEnum,
    @NotNull
    UUID cashRegisterId,
    @NotNull
    UUID voluntaryId
) {
}
