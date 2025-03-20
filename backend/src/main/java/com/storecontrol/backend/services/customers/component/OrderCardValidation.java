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
  OrderCardRepository repository;

  @Autowired
  MessageResolver messageResolver;

  public void checkNameDuplication(String cardId) {
    if (repository.existsById(cardId)) {
      throw new InvalidDatabaseInsertionException(
          messageResolver.getMessage("validation.orderCard.checkName.nameDuplication.error"),
          messageResolver.getMessage("validation.orderCard.checkName.nameDuplication.message"),
          Map.of(
              messageResolver.getMessage("validation.orderCard.checkName.nameDuplication.field"),
              cardId
          )
      );
    }
  }
}
