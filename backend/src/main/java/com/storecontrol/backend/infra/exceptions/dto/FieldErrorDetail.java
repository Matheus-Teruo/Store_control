package com.storecontrol.backend.infra.exceptions.dto;

public record FieldErrorDetail(
        String field,
        String message
) {
}

