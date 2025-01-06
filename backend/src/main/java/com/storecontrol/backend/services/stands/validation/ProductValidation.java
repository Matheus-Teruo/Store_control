package com.storecontrol.backend.services.stands.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.repositories.stands.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ProductValidation {

  @Autowired
  ProductRepository repository;

  public void checkNameDuplication(String productName) {
    if (repository.existsByProductName(productName)) {
      throw new InvalidDatabaseInsertionException(
          MessageResolver.getInstance().getMessage("validation.product.checkName.nameDuplication.error"),
          MessageResolver.getInstance().getMessage("validation.product.checkName.nameDuplication.message"),
          Map.of(
              MessageResolver.getInstance().getMessage("validation.product.checkName.nameDuplication.field"),
              productName
          )
      );
    }
  }
}
