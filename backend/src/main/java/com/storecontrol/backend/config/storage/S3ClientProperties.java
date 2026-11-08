package com.storecontrol.backend.config.storage;

public record S3ClientProperties(
    String endpoint,
    String publicEndpoint,
    String region,
    String bucket,
    KeyProperties key
) {
    public record KeyProperties(
        String access,
        String secret
    ) {
    }
}
