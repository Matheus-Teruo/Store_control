package com.storecontrol.backend.services.customers.validation;

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
          "name already used",
          "OrderCard",
          Map.of("cardId", cardId)
      );
    }
  }
}
