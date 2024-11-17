package com.storecontrol.backend.controllers.response.purchase;

import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.response.item.ResponseItem;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.Purchase;

import java.util.List;
import java.util.UUID;

public record ResponsePurchase(
    UUID uuid,
    Boolean onOrder,
    String purchaseTimeStamp,
    List<ResponseItem> items,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponsePurchase(Purchase purchase) {
    this(
        purchase.getUuid(),
        purchase.getOnOrder(),
        purchase.getPurchaseTimeStamp().toString(),
        purchase.getItems().stream().map(ResponseItem::new).toList(),
        new ResponseSummaryCustomer(purchase.getCustomer()),
        new ResponseSummaryVoluntary(purchase.getVoluntary())
    );
  }
}
