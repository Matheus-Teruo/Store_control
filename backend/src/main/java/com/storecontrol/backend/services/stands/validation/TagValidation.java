package com.storecontrol.backend.services.stands.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.repositories.stands.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class TagValidation {

  @Autowired
  private TagRepository repository;

  public void checkNameDuplication(String productName) {
    if (repository.existsByTagName(productName)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.tag.checkName.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.tag.checkName.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.tag.checkName.nameDuplication.field"),
              productName
          )
      );
    }
  }
}
