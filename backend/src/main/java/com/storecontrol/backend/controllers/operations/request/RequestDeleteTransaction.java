package com.storecontrol.backend.controllers.operations.request;

import jakarta.validation.constraints.NotBlank;

public record RequestDeleteTransaction(
    @NotBlank
    String uuid
) {
}
