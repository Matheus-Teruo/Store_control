package com.storecontrol.backend.services.operations.validation;

import com.storecontrol.backend.infra.exceptions.InvalidOperationException;
import com.storecontrol.backend.models.customers.Customer;
import com.storecontrol.backend.models.operations.purchases.Item;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreateItem;
import com.storecontrol.backend.models.operations.purchases.request.RequestCreatePurchase;
import com.storecontrol.backend.models.operations.purchases.request.RequestUpdateItem;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.volunteers.Voluntary;
import com.storecontrol.backend.services.stands.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PurchaseValidation {

  @Autowired
  ProductService productService;

  public void checkVoluntaryFunctionMatch(Voluntary voluntary) {
    if (!voluntary.isSuperuser()) {
      if ((voluntary.getFunction() == null)) {
        throw new InvalidOperationException("Create Purchase", "This voluntary has no role");
      } else {
        if (!(voluntary.getFunction() instanceof Stand)) {
          throw new InvalidOperationException("Create Purchase", "This voluntary can't do this operation");
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
                .multiply(requestCreateItem.unitPrice()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (totalValue.compareTo(customer.getOrderCard().getDebit()) > 0) {
      throw new InvalidOperationException("Create Purchase", "Insufficient credit on card");
    }
  }

  public void checkInsufficientProductStockValidity(RequestCreatePurchase request) {
    for (RequestCreateItem requestCreateItem : request.items()) {
      var product = productService.safeTakeProductByUuid(requestCreateItem.productId());

      if (product.getStock() < requestCreateItem.quantity()) {
        throw new InvalidOperationException("Create Purchase", "Insufficient product stock");
      }
    }
  }

  public void checkItemsFromPurchaseValidation(List<RequestUpdateItem> request, List<Item> items) {
    if (request != null && !request.isEmpty()) {

      var itemsMap = items.stream().collect(Collectors.toMap(
          item -> item.getItemId().getProduct().getUuid(),
          item -> item
      ));

      request.forEach(requestUpdateItem -> {
        var item = itemsMap.get(requestUpdateItem.productId());
        if (item != null) {
          if (requestUpdateItem.delivered() > item.getQuantity()) {
            throw new InvalidOperationException("Update Purchase",
                "Delivered not allow to be bigger than quantity");
          }
        } else {
          throw new InvalidOperationException("Delete Purchase",
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
