package com.storecontrol.backend.config.cors;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "config.spring.cors")
public record CorsProperties(
    String acceptUrl
) {
}
