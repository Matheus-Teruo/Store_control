package com.storecontrol.backend.services.registers.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.repositories.volunteers.FunctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class RegisterValidation {

  @Autowired
  private FunctionRepository repository;

  public void checkNameDuplication(String registerName) {
    if (repository.existsByFunctionName(registerName)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.register.checkName.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.register.checkName.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.register.checkName.nameDuplication.field"),
              registerName
          )
      );
    }
  }
}
