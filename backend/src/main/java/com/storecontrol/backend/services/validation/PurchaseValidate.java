package com.storecontrol.backend.services.validation;

import com.storecontrol.backend.controllers.request.purchase.RequestPurchase;
import com.storecontrol.backend.controllers.request.item.RequestItem;
import com.storecontrol.backend.models.Customer;
import com.storecontrol.backend.models.Purchase;
import com.storecontrol.backend.models.Item;
import com.storecontrol.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PurchaseValidate {

  @Autowired
  ProductService productService;

  public void checkInsufficientCreditValidity(RequestPurchase request, Customer customer) {
    var totalValue = request
        .requestItems()
        .stream()
        .map(requestItem ->
            BigDecimal.valueOf(requestItem.quantity())
                .multiply(new BigDecimal(requestItem.unitPrice())))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (totalValue.compareTo(customer.getOrderCard().getDebit()) > 0) {
      // TODO: error
    }
  }

  public void checkInsufficientProductStockValidity(RequestPurchase request) {
    for (RequestItem requestItem : request.requestItems()) {
      var product = productService.takeProductByUuid(requestItem.productId());

      if (product.getStock() < requestItem.quantity()) {
        // TODO: error
      }
    }
  }

  public void checkSomeItemWasDelivered(Purchase purchase) {
    for (Item item : purchase.getItems()) {
      if (item.getDelivered() != null && item.getDelivered() != 0) {
        // TODO: error
      }
    }
  }
}
