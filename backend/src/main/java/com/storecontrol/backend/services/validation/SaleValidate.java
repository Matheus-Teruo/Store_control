package com.storecontrol.backend.services.validation;

import com.storecontrol.backend.controllers.request.good.RequestGood;
import com.storecontrol.backend.controllers.request.sale.RequestSale;
import com.storecontrol.backend.models.Customer;
import com.storecontrol.backend.models.Good;
import com.storecontrol.backend.models.Sale;
import com.storecontrol.backend.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class SaleValidate {

  @Autowired
  ItemService itemService;

  public void checkInsufficientCreditValidity(RequestSale request, Customer customer) {
    var totalValue = request
        .requestGoods()
        .stream()
        .map(requestGood ->
            BigDecimal.valueOf(requestGood.quantity())
                .multiply(new BigDecimal(requestGood.unitPrice())))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    if (totalValue.compareTo(customer.getOrderCard().getDebit()) > 0) {
      // TODO: error
    }
  }

  public void checkInsufficientStockItemValidity(RequestSale request) {
    for (RequestGood requestGood : request.requestGoods()) {
      var item = itemService.takeItemByUuid(requestGood.itemId());

      if (item.getStock() < requestGood.quantity()) {
        // TODO: error
      }
    }
  }

  public void checkSomeGoodWasDelivered(Sale sale) {
    for (Good good : sale.getGoods()) {
      if (good.getDelivered() != null && good.getDelivered() != 0) {
        // TODO: error
      }
    }
  }
}
