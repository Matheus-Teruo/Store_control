package com.storecontrol.backend.config.setup;

import com.storecontrol.backend.models.customers.Card;
import com.storecontrol.backend.models.volunteers.User;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.customers.CardRepository;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableConfigurationProperties(DataInitializerProperties.class)
@RequiredArgsConstructor
public class DataInitializer {

  private final DataInitializerProperties props;

  @Bean
  public CommandLineRunner createAdminUser(VoluntaryRepository repository, CardRepository cardRepository, PasswordEncoder passwordEncoder) {
    return args -> {
      if (!repository.existsByFullname("Root User")) {
        var rootUser = new User(props.root().username(), passwordEncoder.encode(props.root().password()));
        var admin = new Voluntary(rootUser, "Root User");
        repository.save(admin);
        System.out.println("Usuário root criado com sucesso!");
      }
      if (!cardRepository.existsById(props.cardId())) {
        var card = new Card(props.cardId());
        cardRepository.save(card);
        System.out.println("Cartão fixo criado com sucesso!");
      }
    };
  }
}