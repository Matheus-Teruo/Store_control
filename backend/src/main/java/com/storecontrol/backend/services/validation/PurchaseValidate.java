package com.storecontrol.backend.services.validation;

import com.storecontrol.backend.controllers.request.purchase.RequestPurchase;
import com.storecontrol.backend.controllers.request.purchaseItem.RequestPurchaseItem;
import com.storecontrol.backend.models.Customer;
import com.storecontrol.backend.models.Purchase;
import com.storecontrol.backend.models.PurchaseItem;
import com.storecontrol.backend.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PurchaseValidate {

  @Autowired
  ItemService itemService;

  public void checkInsufficientCreditValidity(RequestPurchase request, Customer customer) {
    var totalValue = request
        .requestPurchaseItems()
        .stream()
        .map(requestPurchaseItem ->
            BigDecimal.valueOf(requestPurchaseItem.quantity())
                .multiply(new BigDecimal(requestPurchaseItem.unitPrice())))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (totalValue.compareTo(customer.getOrderCard().getDebit()) > 0) {
      // TODO: error
    }
  }

  public void checkInsufficientStockItemValidity(RequestPurchase request) {
    for (RequestPurchaseItem requestPurchaseItem : request.requestPurchaseItems()) {
      var item = itemService.takeItemByUuid(requestPurchaseItem.itemId());

      if (item.getStock() < requestPurchaseItem.quantity()) {
        // TODO: error
      }
    }
  }

  public void checkSomePurchaseItemWasDelivered(Purchase purchase) {
    for (PurchaseItem purchaseItem : purchase.getPurchaseItems()) {
      if (purchaseItem.getDelivered() != null && purchaseItem.getDelivered() != 0) {
        // TODO: error
      }
    }
  }
}
