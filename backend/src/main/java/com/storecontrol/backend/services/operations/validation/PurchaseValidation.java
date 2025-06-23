package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseInsertionException;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdateItem;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.ProductCombo;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.repositories.operations.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class PurchaseValidation {

  @Autowired
  private PurchaseRepository repository;

  public void checkVoluntaryFunctionMatch(UUID standUuid, Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.purchase.checkVoluntary.functionNull.error"),
            MessageResolver.getInstance().getMessage("validation.purchase.checkVoluntary.functionNull.message")
        );
      } else {
        if (!(voluntary.getFunction().getUuid().equals(standUuid))) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.purchase.checkVoluntary.functionDifferent.error"),
              MessageResolver.getInstance().getMessage("validation.purchase.checkVoluntary.functionDifferent.message")
          );
        }
      }
    }
  }

  public void checkStandFromItems(Voluntary voluntary, List<RequestCreateItem> items, Map<UUID, Product> productMap) {
    Set<UUID> standUuidSet = items.stream()
        .map(item ->
          {Product product = productMap.get(item.productUuid());
          if (product == null) {
            throw new InvalidOperationException(
                MessageResolver.getInstance().getMessage("validation.purchase.checkItems.differentStand.error"),
                MessageResolver.getInstance().getMessage("validation.purchase.checkItems.differentStand.message")
            );
          }
          return product.getStandUuid();})
        .collect(Collectors.toSet());
    if (standUuidSet.size() != 1) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.purchase.checkItems.differentStand.error"),
          MessageResolver.getInstance().getMessage("validation.purchase.checkItems.differentStand.message")
      );

    } else {
      UUID standUuid = standUuidSet.iterator().next();
      if (!standUuid.equals(voluntary.getFunction().getUuid())) {
        if (voluntary.getVoluntaryRole().isNotAdmin()) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.purchase.checkItems.userNotMatch.error"),
              MessageResolver.getInstance().getMessage("validation.purchase.checkItems.userNotMatch.message")
          );
        }
      }
    }
  }

  public void checkItemPriceAndDiscountMatch(RequestCreatePurchase request, Voluntary voluntary, Map<UUID, Product> productMap) {
    for (RequestCreateItem requestCreateItem : request.items()) {
      var product = productMap.get(requestCreateItem.productUuid());

      if (product == null) {
        throw new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("validation.purchase.checkItem.productNull.error"),
            MessageResolver.getInstance().getMessage("validation.purchase.checkItem.productNull.message"),
            requestCreateItem.productUuid().toString()
        );
      }

      if (voluntary.getVoluntaryRole().isNotAdmin()) {
        if (product.getPrice().compareTo(requestCreateItem.unitPrice()) != 0) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.purchase.checkItem.priceDifferent.error"),
              MessageResolver.getInstance().getMessage(
                  "validation.purchase.checkItem.priceDifferent.message",
                  product.getProductName()
              )
          );
        }
        if (product.getDiscount().compareTo(requestCreateItem.discount()) != 0) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.purchase.checkItem.discountDifferent.error"),
              MessageResolver.getInstance().getMessage(
                  "validation.purchase.checkItem.discountDifferent.message",
                  product.getProductName()
              )
          );
        }
      }
    }
  }

  public void checkInsufficientDebitValidity(RequestCreatePurchase request, Customer customer) {
    var totalValue = request
        .items()
        .stream()
        .map(requestCreateItem ->
            BigDecimal.valueOf(requestCreateItem.quantity())
                .multiply(requestCreateItem.unitPrice().subtract(requestCreateItem.discount())))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (totalValue.compareTo(customer.getOrderCard().getDebit()) > 0) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.purchase.checkDebit.insufficientDebit.error"),
          MessageResolver.getInstance().getMessage("validation.purchase.checkDebit.insufficientDebit.message")
      );
    }
  }

  public void checkPurchaseHaveItems(RequestCreatePurchase request) {
    int totalQuantity = request.items().stream()
        .map(RequestCreateItem::quantity)
        .reduce(0, Integer::sum);
    boolean hasInvalidQuantity = request.items().stream()
        .anyMatch(item -> item.quantity() <= 0);

    if (hasInvalidQuantity) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.purchase.checkQuantity.null.error"),
          MessageResolver.getInstance().getMessage("validation.purchase.checkQuantity.null.message")
      );
    }

    if (totalQuantity == 0) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.purchase.checkQuantity.noItem.error"),
          MessageResolver.getInstance().getMessage("validation.purchase.checkQuantity.noItem.message")
      );
    }
  }

  public void checkInsufficientProductStockValidity(RequestCreatePurchase request, Map<UUID, Product> productMap) {
    Map<UUID, Integer> requiredQuantities = new HashMap<>();

    for (RequestCreateItem requestCreateItem : request.items()) {
      var product = productMap.get(requestCreateItem.productUuid());

      requiredQuantities.merge(product.getUuid(), requestCreateItem.quantity(), Integer::sum);

      if (product.isCombo()) {
        for (ProductCombo productCombo : product.getComboProducts()) {
          UUID includedUuid = productCombo.getIncludedProductUuid();
          int includedQuantity = requestCreateItem.quantity() * productCombo.getQuantity();
          requiredQuantities.merge(includedUuid, includedQuantity, Integer::sum);
        }
      }
    }

    for (Map.Entry<UUID, Integer> entry : requiredQuantities.entrySet()) {
      UUID productUuid = entry.getKey();
      int totalRequired = entry.getValue();

      Product product = productMap.get(productUuid);
      Integer stock = product != null ? product.getStock() : null;

      if (stock != null && stock < totalRequired) {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.purchase.checkProduct.insufficientStock.error"),
            MessageResolver.getInstance().getMessage("validation.purchase.checkProduct.insufficientStock.message")
        );
      }
    }
  }

  public void checkPurchasesBelongsManagerStand(UUID standUuid, Voluntary manager) {
    if (manager.getVoluntaryRole().isNotAdmin()) {
      if (!manager.getFunction().getUuid().equals(standUuid)) {
        throw new InvalidDatabaseInsertionException(
            MessageResolver.getInstance().getMessage("validation.purchase.checkManageFunction.invalidStand.error"),
            MessageResolver.getInstance().getMessage("validation.purchase.checkManageFunction.invalidStand.message"),
            Map.of(
                MessageResolver.getInstance().getMessage("validation.purchase.checkManageFunction.invalidStand.field"),
                manager.getUuid().toString()
            )
        );
      }
    }
  }

  public void checkItemsFromPurchaseValidation(List<RequestUpdateItem> requestUpdateItems, List<Item> items) {
    if (requestUpdateItems != null && !requestUpdateItems.isEmpty()) {

      var itemsMap = items.stream().collect(Collectors.toMap(
          item -> item.getItemId().getProduct().getUuid(),
          item -> item
      ));

      requestUpdateItems.forEach(requestUpdateItem -> {
        var item = itemsMap.get(requestUpdateItem.productUuid());

        if (item != null) {
          if (requestUpdateItem.delivered() > item.getQuantity()) {
            throw new InvalidOperationException(
                MessageResolver.getInstance().getMessage("validation.purchase.checkItem.deliveredInvalid.error"),
                MessageResolver.getInstance().getMessage("validation.purchase.checkItem.deliveredInvalid.message")
            );
          }
        } else {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.purchase.checkItem.productNotMatch.error"),
              MessageResolver.getInstance().getMessage(
                  "validation.purchase.checkItem.productNotMatch.message",
                  requestUpdateItem.productUuid()
              )
          );
        }
      });
    }
  }

  public void checkSomeItemWasDelivered(Purchase purchase) {
    for (Item item : purchase.getItems()) {
      if (item.getDelivered() != null && item.getDelivered() != 0) {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.purchase.checkItem.deliveredNotZero.error"),
            MessageResolver.getInstance().getMessage("validation.purchase.checkItem.deliveredNotZero.message")
        );
      }
    }
  }

  public void checkPurchaseBelongsToVoluntary(Purchase purchase, Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin() && !purchase.getVoluntaryUuid().equals(voluntary.getUuid())) {
      throw new InvalidOperationException(
          MessageResolver.getInstance().getMessage("validation.purchase.checkVoluntary.notOwner.error"),
          MessageResolver.getInstance().getMessage("validation.purchase.checkVoluntary.notOwner.message")
      );
    }
  }

  public void checkIfLastPurchaseOfVoluntary(Purchase purchase, Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      Optional<Purchase> optionalPurchase = repository.findLastFromVoluntary(voluntary.getUuid());

      if (optionalPurchase.isPresent()) {
        if (!optionalPurchase.get().getUuid().equals(purchase.getUuid())) {
          throw new InvalidOperationException(
              MessageResolver.getInstance().getMessage("validation.purchase.checkLastPurchase.notLast.error"),
              MessageResolver.getInstance().getMessage("validation.purchase.checkLastPurchase.notLast.message")
          );
        }
      } else {
        throw new InvalidOperationException(
            MessageResolver.getInstance().getMessage("validation.purchase.checkLastPurchase.notPresent.error"),
            MessageResolver.getInstance().getMessage("validation.purchase.checkLastPurchase.notPresent.message")
        );
      }
    }
  }
}
