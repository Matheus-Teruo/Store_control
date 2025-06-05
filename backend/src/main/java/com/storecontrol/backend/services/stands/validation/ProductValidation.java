package com.storecontrol.backend.services.stands.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.request.RequestCreateProductCombo;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.stands.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class ProductValidation {

  @Autowired
  private ProductRepository repository;

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

  public void checkProductBelongsManagerStand(UUID standUuid, Voluntary manager) {
    if (manager.getVoluntaryRole().isNotAdmin()) {
      if (!manager.getFunction().getUuid().equals(standUuid)) {
        throw new InvalidDatabaseInsertionException(
            MessageResolver.getInstance().getMessage("validation.product.checkManageFunction.invalidStand.error"),
            MessageResolver.getInstance().getMessage("validation.product.checkManageFunction.invalidStand.message"),
            Map.of(
                MessageResolver.getInstance().getMessage("validation.product.checkManageFunction.invalidStand.field"),
                manager.getUuid().toString()
            )
        );
      }
    }
  }

  public void checkProductIncludedOnComboBelongsStand(List<RequestCreateProductCombo> includedProductsCombo, Map<UUID, Product> productMap) {
    for (RequestCreateProductCombo includedProduct : includedProductsCombo) {
      UUID uuid = includedProduct.includedProductUuid();

      if (!productMap.containsKey(uuid)) {
        throw new InvalidDatabaseInsertionException(
            MessageResolver.getInstance().getMessage("validation.product.checkCombo.invalidProductStand.error"),
            MessageResolver.getInstance().getMessage("validation.product.checkCombo.invalidProductStand.message"),
            Map.of(
                MessageResolver.getInstance().getMessage("validation.product.checkCombo.invalidProductStand.field"),
                uuid.toString()
            )
        );
      }
    }
  }

  public void checkProductIncludedOnComboIsNotACombo(List<RequestCreateProductCombo> includedProductsCombo, Map<UUID, Product> productMap) {
    for (RequestCreateProductCombo includedProduct : includedProductsCombo) {
      UUID uuid = includedProduct.includedProductUuid();

      if (productMap.get(uuid).isCombo()) {
        throw new InvalidDatabaseInsertionException(
            MessageResolver.getInstance().getMessage("validation.product.checkCombo.invalidProductCombo.error"),
            MessageResolver.getInstance().getMessage("validation.product.checkCombo.invalidProductCombo.message"),
            Map.of(
                MessageResolver.getInstance().getMessage("validation.product.checkCombo.invalidProductCombo.field"),
                uuid.toString()
            )
        );
      }
    }
  }
}
