package com.storecontrol.backend.config;

import com.google.cloud.storage.Storage;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class GCSTestConfig {

  @Bean
  @Primary
  public Storage mockStorage() {
    return Mockito.mock(Storage.class);
  }
}
