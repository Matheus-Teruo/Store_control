package com.storecontrol.backend.models.operations.purchases.response;

import com.storecontrol.backend.models.customers.response.ResponseSummaryCustomer;
import com.storecontrol.backend.models.volunteers.response.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.operations.purchases.Purchase;

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
        purchase.isOnOrder(),
        purchase.getPurchaseTimeStamp().toString(),
        purchase.getItems().stream().map(ResponseItem::new).toList(),
        new ResponseSummaryCustomer(purchase.getCustomer()),
        new ResponseSummaryVoluntary(purchase.getVoluntary())
    );
  }
}
