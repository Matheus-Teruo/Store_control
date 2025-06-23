package com.storecontrol.backend.services.customers.component;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.repositories.customers.OrderCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OrderCardValidation {

  @Autowired
  private OrderCardRepository repository;

  public void checkNameDuplication(String cardId) {
    if (repository.existsById(cardId)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.orderCard.checkName.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.orderCard.checkName.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.orderCard.checkName.nameDuplication.field"),
              cardId
          )
      );
    }
  }
}
