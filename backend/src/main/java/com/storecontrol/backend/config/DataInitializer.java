package com.storecontrol.backend.config;

import com.storecontrol.backend.models.volunteers.User;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

  @Value("${initializer.root.username}")
  private String username;

  @Value("${initializer.root.password}")
  private String secret;

  @Bean
  public CommandLineRunner createAdminUser(VoluntaryRepository repository, PasswordEncoder passwordEncoder) {
    return args -> {
      if (!repository.existsByFullname("Root User")) {
        var rootUser = new User(username, passwordEncoder.encode(secret));
        var admin = new Voluntary(rootUser, "Root User");
        repository.save(admin);
        System.out.println("Usuário root criado com sucesso!");
      }
    };
  }
}