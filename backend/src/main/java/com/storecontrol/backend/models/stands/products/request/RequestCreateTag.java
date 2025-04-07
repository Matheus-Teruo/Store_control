package com.storecontrol.backend.models.stands.products.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RequestCreateTag(
    @NotBlank(message = "{request.validation.createProductTag.tagName.notBlank}")
    @Size(min = 3, message = "{request.validation.createProductTag.tagName.size}")
    @Pattern(regexp = "^[\\p{L}\\p{N}]*$", message = "{request.validation.createProductTag.tagName.pattern}")
    String tagName,

    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "{request.validation.createProductTag.color.pattern}")
    String color
) {
}
