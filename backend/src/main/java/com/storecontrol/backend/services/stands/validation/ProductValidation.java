package com.storecontrol.backend.services.stands.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.repositories.stands.ProductRepository;
import com.storecontrol.backend.repositories.volunteers.VoluntaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class ProductValidation {

  @Autowired
  ProductRepository repository;

  @Autowired
  VoluntaryRepository voluntaryRepository;

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

  public void checkProductBelongsManagerStand(UUID standUuid,UUID userUuid) {
    var manager = voluntaryRepository.findByUuidValidTrue(userUuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
        MessageResolver.getInstance().getMessage("service.exception.product.get.validation.error"),
        MessageResolver.getInstance().getMessage("service.exception.product.get.validation.message"),
        userUuid.toString())
    );
    if (manager.getVoluntaryRole().isNotAdmin()) {
      if (!manager.getFunction().getUuid().equals(standUuid)) {
        throw new InvalidDatabaseInsertionException(
            MessageResolver.getInstance().getMessage("validation.product.checkManageFunction.invalidStand.error"),
            MessageResolver.getInstance().getMessage("validation.product.checkManageFunction.invalidStand.message"),
            Map.of(
                MessageResolver.getInstance().getMessage("validation.product.checkManageFunction.invalidStand.field"),
                userUuid.toString()
            )
        );
      }
    }
  }
}
