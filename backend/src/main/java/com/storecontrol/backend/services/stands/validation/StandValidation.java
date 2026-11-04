package com.storecontrol.backend.services.stands.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.repositories.volunteers.FunctionRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class StandValidation {

  private final FunctionRepository repository;

  public void checkNameDuplication(String standName) {
    if (repository.existsByFunctionName(standName)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.stand.checkName.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.stand.checkName.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.stand.checkName.nameDuplication.field"),
              standName
          )
      );
    }
  }
}
