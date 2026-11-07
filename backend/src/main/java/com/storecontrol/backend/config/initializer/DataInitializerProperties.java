package com.storecontrol.backend.config.initializer;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties (prefix = "config.initializer")
public record DataInitializerProperties(
    RootProperties root,
    String cardId
) {
    public record RootProperties(
        String username,
        String password
    ) {
    }
}
