package com.storecontrol.backend.services.registers.validation;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.repositories.volunteers.FunctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CashRegisterValidation {

  @Autowired
  FunctionRepository repository;

  public void checkNameDuplication(String cashRegisterName) {
    if (repository.existsByFunctionName(cashRegisterName)) {
      throw new InvalidDatabaseInsertionException(
          "name already used",
          "CashRegister",
          Map.of("functionName", cashRegisterName)
      );
    }
  }
}
