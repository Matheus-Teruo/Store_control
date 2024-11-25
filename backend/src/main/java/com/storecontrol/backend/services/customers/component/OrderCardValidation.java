package com.storecontrol.backend.services.customers.component;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.repositories.customers.OrderCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OrderCardValidation {

  @Autowired
  OrderCardRepository repository;

  public void checkNameDuplication(String cardId) {
    if (repository.existsById(cardId)) {
      throw new InvalidDatabaseInsertionException(
          "cardId already exist",
          "OrderCard",
          Map.of("cardId", cardId)
      );
    }
  }
}
