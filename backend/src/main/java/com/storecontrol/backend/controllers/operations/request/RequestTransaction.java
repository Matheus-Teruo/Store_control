package com.storecontrol.backend.controllers.operations.request;

import jakarta.validation.constraints.NotBlank;

public record RequestTransaction(
    @NotBlank
    String amount,
    @NotBlank
    String transactionTypeEnum,
    @NotBlank
    String cashRegisterId,
    @NotBlank
    String voluntaryId
) {
}
