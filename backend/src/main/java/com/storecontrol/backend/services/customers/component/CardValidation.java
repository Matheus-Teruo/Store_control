package com.storecontrol.backend.services.customers.component;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.repositories.customers.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CardValidation {

  @Autowired
  private CardRepository repository;

  public void checkNameDuplication(String cardId) {
    if (repository.existsById(cardId)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.card.checkName.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.card.checkName.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.card.checkName.nameDuplication.field"),
              cardId
          )
      );
    }
  }
}
