package com.storecontrol.backend.services.stands.validation;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.repositories.stands.AssociationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AssociationValidation {

  @Autowired
  AssociationRepository repository;

  public void checkNameDuplication(String associationName) {
    if (repository.existsByAssociationName(associationName)) {
      throw new InvalidDatabaseInsertionException(
          "name already used",
          "Association",
          Map.of("assiciationName", associationName)
      );
    }
  }
}
