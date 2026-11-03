package com.storecontrol.backend.services.stands.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.repositories.stands.AssociationRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class AssociationValidation {

  private final AssociationRepository repository;

  public void checkNameDuplication(String associationName) {
    if (repository.existsByAssociationName(associationName)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.association.checkName.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.association.checkName.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.association.checkName.nameDuplication.field"),
              associationName
          )
      );
    }

  }
  public void checkKeyDuplication(String associationKey) {
    if (repository.existsByAssociationKey(associationKey)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.association.associationKey.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.association.associationKey.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.association.associationKey.nameDuplication.field"),
              associationKey
          )
      );
    }
  }
}
