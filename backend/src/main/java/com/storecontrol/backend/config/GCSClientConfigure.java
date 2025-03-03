package com.storecontrol.backend.config;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@Configuration
@ConditionalOnProperty(name = "gcp.storage.enabled", havingValue = "true")
public class GCSClientConfigure {

  @Value("${gcp.storage.credentials-json}")
  private String credentialsJson;

  @Value("${gcp.storage.project-id}")
  private String projectId;

  @Bean
  public Storage storage() throws IOException {
    if (credentialsJson != null && projectId != null) {
      return StorageOptions.newBuilder()
          .setProjectId(projectId)
          .setCredentials(ServiceAccountCredentials.fromStream(new ByteArrayInputStream(credentialsJson.getBytes())))
          .build()
          .getService();
    } else {
      return StorageOptions.getDefaultInstance().getService();
    }
  }
}
