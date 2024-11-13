package com.storecontrol.backend.controllers.response.purchase;

import com.storecontrol.backend.controllers.response.customer.ResponseSummaryCustomer;
import com.storecontrol.backend.controllers.response.purchaseItem.ResponsePurchaseItem;
import com.storecontrol.backend.controllers.response.voluntary.ResponseSummaryVoluntary;
import com.storecontrol.backend.models.Purchase;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ResponsePurchase(
    UUID uuid,
    Boolean onOrder,
    LocalDateTime saleTimeStamp,
    List<ResponsePurchaseItem> goods,
    ResponseSummaryCustomer summaryCustomer,
    ResponseSummaryVoluntary summaryVoluntary
) {

  public ResponsePurchase(Purchase purchase) {
    this(
        purchase.getUuid(),
        purchase.getOnOrder(),
        purchase.getPurchaseTimeStamp(),
        purchase.getPurchaseItems().stream().map(ResponsePurchaseItem::new).toList(),
        new ResponseSummaryCustomer(purchase.getCustomer()),
        new ResponseSummaryVoluntary(purchase.getVoluntary())
    );
  }
}
