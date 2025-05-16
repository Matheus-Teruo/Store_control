package com.storecontrol.backend.models.stands.products.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RequestUpdateTag(
    @NotNull(message = "{request.validation.updateProductTag.uuid.notnull}")
    UUID uuid,

    @Size(min = 3, message = "{request.validation.updateProductTag.tagName.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N} /:;,.!()?\\-]*$", message = "{request.validation.updateProductTag.tagName.pattern}")
    String tagName,

    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "{request.validation.updateProductTag.color.pattern}")
    String color
) {
}
