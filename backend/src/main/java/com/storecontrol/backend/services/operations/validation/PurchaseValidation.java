package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdateItem;
import com.storecontrol.backend.models.stands.Product;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class PurchaseValidation {

  public void checkVoluntaryFunctionMatch(Voluntary voluntary) {
    if (voluntary.getVoluntaryRole().isNotAdmin()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException("Create Purchase", "This voluntary has no role");
      } else {
        if (!(voluntary.getFunction() instanceof Stand)) {
          throw new InvalidOperationException("Create Purchase", "This voluntary can't do this operation");
        }
      }
    }
  }

  public void checkItemPriceAndDiscountMatch(RequestCreatePurchase request, Voluntary voluntary, Map<UUID, Product> productMap) {
    for (RequestCreateItem requestCreateItem : request.items()) {
      var product = productMap.get(requestCreateItem.productId());

      if (product == null) {
        throw new InvalidDatabaseQueryException("Non-existent entity", "Product", requestCreateItem.productId().toString());
      }

      if (voluntary.getVoluntaryRole().isNotAdmin()) {
        if (product.getPrice().compareTo(requestCreateItem.unitPrice()) != 0) {
          throw new InvalidOperationException("Create Purchase", "Price of product " +
              product.getProductName() +
              " was changed without authorization");
        }
        if (product.getDiscount().compareTo(requestCreateItem.discount()) != 0) {
          throw new InvalidOperationException("Create Purchase", "Discount of product " +
              product.getProductName() +
              " was changed without authorization");
        }
      }
    }
  }

  public void checkInsufficientCreditValidity(RequestCreatePurchase request, Customer customer) {
    var totalValue = request
        .items()
        .stream()
        .map(requestCreateItem ->
            BigDecimal.valueOf(requestCreateItem.quantity())
                .multiply(requestCreateItem.unitPrice().subtract(requestCreateItem.discount())))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (totalValue.compareTo(customer.getOrderCard().getDebit()) > 0) {
      throw new InvalidOperationException("Create Purchase", "Insufficient credit on card");
    }
  }

  public void checkInsufficientProductStockValidity(RequestCreatePurchase request, Map<UUID, Product> productMap) {
    for (RequestCreateItem requestCreateItem : request.items()) {
      var product = productMap.get(requestCreateItem.productId());

      if (product.getStock() < requestCreateItem.quantity()) {
        throw new InvalidOperationException("Create Purchase", "Insufficient product stock");
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
        var item = itemsMap.get(requestUpdateItem.productId());

        if (item != null) {
          if (requestUpdateItem.delivered() > item.getQuantity()) {
            throw new InvalidOperationException("Update Purchase",
                "Delivered not allow to be bigger than quantity");
          }
        } else {
          throw new InvalidOperationException("Update Purchase",
              "This product (" + requestUpdateItem.productId() + ") is not allocate in this purchase like item");
        }
      });
    }
  }

  public void checkSomeItemWasDelivered(Purchase purchase) {
    for (Item item : purchase.getItems()) {
      if (item.getDelivered() != null && item.getDelivered() != 0) {
        throw new InvalidOperationException("Delete Purchase", "One item was delivered already");
      }
    }
  }
}
