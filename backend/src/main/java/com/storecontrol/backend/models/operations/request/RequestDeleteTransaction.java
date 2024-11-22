package com.storecontrol.backend.models.operations.request;

import jakarta.validation.constraints.NotBlank;

public record RequestDeleteTransaction(
    @NotBlank
    String uuid
) {
}
